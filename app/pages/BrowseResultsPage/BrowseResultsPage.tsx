import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import * as dataService from "utils/DataService";
import { DEFAULT_AROUND_PRECISION, useAppContext } from "utils";
import { SearchMapActions } from "components/SearchAndBrowse/SearchResults/SearchResults";
import { Loader } from "components/ui/Loader";
import Sidebar from "components/SearchAndBrowse/Sidebar/Sidebar";
import { BrowseSubheader } from "components/SearchAndBrowse/Header/BrowseSubheader";
import { PageHeader } from "components/ui/Navigation/PageHeader";
import { BrowseHeaderSection } from "components/SearchAndBrowse/Header/BrowseHeaderSection";
import {
  useEligibilitiesForCategory,
  useSubcategoriesForCategory,
} from "hooks/APIHooks";
import { CATEGORIES, ServiceCategory } from "../constants";
import styles from "./BrowseResultsPage.module.scss";
import { Configure, useClearRefinements } from "react-instantsearch-core";
import { SearchMap } from "components/SearchAndBrowse/SearchMap/SearchMap";
import { SearchResult } from "components/SearchAndBrowse/SearchResults/SearchResult";
import {
  TransformedSearchHit,
  transformSearchResults,
} from "models/SearchHits";
import { useInstantSearch, usePagination } from "react-instantsearch";
import ResultsPagination from "components/SearchAndBrowse/Pagination/ResultsPagination";
import searchResultsStyles from "components/SearchAndBrowse/SearchResults/SearchResults.module.scss";
import { SearchResultsHeader } from "components/ui/SearchResultsHeader";

/** Wrapper component that handles state management, URL parsing, and external API requests. */
export const BrowseResultsPage = () => {
  const { categorySlug } = useParams();
  const category = CATEGORIES.find((c) => c.slug === categorySlug);
  if (category === undefined) {
    throw new Error(`Unknown category slug ${categorySlug}`);
  }
  const [parentCategory, setParentCategory] = useState<ServiceCategory | null>(
    null
  );
  const eligibilities = useEligibilitiesForCategory(category.id);
  const subcategories = useSubcategoriesForCategory(category.id);
  const [isMapCollapsed, setIsMapCollapsed] = useState(false);
  const { userLocation } = useAppContext();
  const { aroundUserLocationRadius, aroundLatLng } = useAppContext();
  const {
    // Results type is algoliasearchHelper.SearchResults<SearchHit>
    results: searchResults,
    status,
  } = useInstantSearch();
  const { refine: refinePagination } = usePagination();
  const { refine: clearRefinements } = useClearRefinements();

  const handleFirstResultFocus = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      node.focus();
    }
  }, []);

  const subcategoryNames = subcategories?.map((c) => c.name);
  const { name: categoryName, sortAlgoliaSubcategoryRefinements } = category;

  // TODO: Handle failure?
  useEffect(() => {
    clearRefinements();
    dataService
      .get(`/api/categories/${category.id}`)
      .then(({ category: serviceCategory }: { category: ServiceCategory }) => {
        setParentCategory(serviceCategory);
      });
  }, [category.id, clearRefinements]);

  const escapeApostrophes = (str: string): string => str.replace(/'/g, "\\'");
  const algoliaCategoryName = parentCategory?.name
    ? escapeApostrophes(parentCategory.name)
    : null;

  const searchMapHitData = transformSearchResults(searchResults);

  const hasNoResults = searchMapHitData.nbHits === 0 && status === "idle";

  const handleAction = (searchMapAction: SearchMapActions) => {
    switch (searchMapAction) {
      case SearchMapActions.SearchThisArea:
        return refinePagination(0);
    }
  };

  // TS compiler requires explict null type checks
  if (
    eligibilities === null ||
    subcategories === null ||
    algoliaCategoryName === null ||
    userLocation === null
  ) {
    return <Loader />;
  }

  return (
    <>
      <PageHeader>
        <BrowseHeaderSection descriptionText="Sign up for programs and access resources." />
      </PageHeader>
      <div className={styles.container}>
        <BrowseSubheader currentCategory={categoryName} />
        <Configure
          filters={`categories:'${algoliaCategoryName}'`}
          aroundLatLng={aroundLatLng}
          aroundRadius={aroundUserLocationRadius}
          aroundPrecision={DEFAULT_AROUND_PRECISION}
        />

        <div className={styles.flexContainer}>
          <Sidebar
            isSearchResultsPage={false}
            eligibilities={eligibilities || []}
            subcategories={subcategories || []}
            subcategoryNames={subcategoryNames || []}
            sortAlgoliaSubcategoryRefinements={
              sortAlgoliaSubcategoryRefinements
            }
            isMapCollapsed={isMapCollapsed}
            setIsMapCollapsed={setIsMapCollapsed}
          />

          <div className={styles.results}>
            <div className={searchResultsStyles.searchResultsAndMapContainer}>
              <div
                className={`${searchResultsStyles.searchResultsContainer} ${
                  isMapCollapsed
                    ? searchResultsStyles.resultsPositionWhenMapCollapsed
                    : ""
                }`}
              >
                <h2 className="sr-only">Search results</h2>
                <>
                  {/* This is browse not search */}
                  <SearchResultsHeader>
                    <h2>{searchResults.nbHits} results</h2>
                  </SearchResultsHeader>
                  {searchMapHitData.hits.map(
                    (hit: TransformedSearchHit, index) => (
                      <SearchResult
                        hit={hit}
                        key={`${hit.id} - ${hit.name}`}
                        ref={index === 0 ? handleFirstResultFocus : null}
                      />
                    )
                  )}
                  <div
                    className={`${searchResultsStyles.paginationContainer} ${
                      hasNoResults ? searchResultsStyles.hidePagination : ""
                    }`}
                  >
                    <div className={searchResultsStyles.resultsPagination}>
                      <ResultsPagination />
                    </div>
                  </div>
                </>
              </div>
              <SearchMap
                hits={searchMapHitData.hits}
                mobileMapIsCollapsed={isMapCollapsed}
                handleSearchMapAction={handleAction}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
