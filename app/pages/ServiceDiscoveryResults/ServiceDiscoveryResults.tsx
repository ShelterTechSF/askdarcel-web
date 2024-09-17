import React, { useState, useEffect } from "react";
import { liteClient } from "algoliasearch/lite";
import { InstantSearch, Configure } from "react-instantsearch";
import qs from "qs";
import { Helmet } from "react-helmet-async";
import { match as Match, RouteComponentProps } from "react-router-dom";
import * as dataService from "utils/DataService";
import {
  COORDS_MID_SAN_FRANCISCO,
  DEFAULT_AROUND_PRECISION,
  useAppContext,
  websiteConfig,
} from "utils";
import { Loader } from "components/ui";
import SearchResults from "components/search/SearchResults/SearchResults";
import Sidebar from "components/search/Sidebar/Sidebar";
import { Header } from "components/search/Header/Header";
import { SecondaryNavigationWrapper } from "components/navigation/SecondaryNavigationWrapper";
import { SearchHeaderSection } from "components/search/Header/SearchHeaderSection";

import {
  useEligibilitiesForCategory,
  useSubcategoriesForCategory,
} from "hooks/APIHooks";
import { SiteSearchInput } from "components/ui/SiteSearchInput";
import config from "../../config";
import { CATEGORIES, ServiceCategory } from "../constants";
import styles from "./ServiceDiscoveryResults.module.scss";

type MatchParams = { categorySlug: string };
type RouterLocation = RouteComponentProps["location"];

/* eslint-disable @typescript-eslint/no-unsafe-argument */
const searchClient = liteClient(
  config.ALGOLIA_APPLICATION_ID,
  config.ALGOLIA_READ_ONLY_API_KEY
);

const urlToSearchState = (location: RouterLocation) =>
  qs.parse(location.search.slice(1));

/** Wrapper component that handles state management, URL parsing, and external API requests. */
export const ServiceDiscoveryResults = ({
  location,
  match,
}: {
  location: RouteComponentProps["location"];
  match: Match<MatchParams>;
}) => {
  const { categorySlug } = match.params;
  const category = CATEGORIES.find((c) => c.slug === categorySlug);
  if (category === undefined) {
    throw new Error(`Unknown category slug ${categorySlug}`);
  }
  const [parentCategory, setParentCategory] = useState<ServiceCategory | null>(
    null
  );
  const eligibilities = useEligibilitiesForCategory(category.id);
  const subcategories = useSubcategoriesForCategory(category.id);
  /* eslint-disable */
  const [searchState] = useState<any>(urlToSearchState(location));
  const [isMapCollapsed, setIsMapCollapsed] = useState(false);
  const [searchRadius, setSearchRadius] = useState<number | "all">(
    searchState?.configure?.aroundRadius || "all"
  );
  const { userLocation } = useAppContext();
  const [aroundLatLng, setAroundLatLng] = useState({
    lat: userLocation?.lat || COORDS_MID_SAN_FRANCISCO.lat,
    lng: userLocation?.lng || COORDS_MID_SAN_FRANCISCO.lng,
  });

  const subcategoryNames = subcategories?.map((c) => c.name);
  const { name: categoryName, sortAlgoliaSubcategoryRefinements } = category;

  // TODO: Handle failure?
  useEffect(() => {
    dataService
      .get(`/api/categories/${category.id}`)
      .then(({ category: serviceCategory }: { category: ServiceCategory }) => {
        setParentCategory(serviceCategory);
      });
  }, [category.id]);

  const escapeApostrophes = (str: string): string => str.replace(/'/g, "\\'");
  const algoliaCategoryName = parentCategory?.name
    ? escapeApostrophes(parentCategory.name)
    : null;

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
      <SecondaryNavigationWrapper>
        <SearchHeaderSection descriptionText="Sign up for programs and access resources." />
      </SecondaryNavigationWrapper>
      <div className={styles.container}>
        <Helmet>
          <title>{`${categoryName} in San Francisco | ${websiteConfig.title}`}</title>
          <meta
            name="description"
            content={`A list of ${categoryName} in San Francisco`}
          />
        </Helmet>
        <Header currentCategory={categoryName} />

        <InstantSearch
          searchClient={searchClient}
          indexName={`${config.ALGOLIA_INDEX_PREFIX}_services_search`}
          initialUiState={searchState}
          routing
        >
          {category.disableGeoLocation ? (
            <Configure filters={`categories:'${algoliaCategoryName}'`} />
          ) : (
            <Configure
              filters={`categories:'${algoliaCategoryName}'`}
              aroundLatLng={`${aroundLatLng.lat}, ${aroundLatLng.lng}`}
              aroundRadius={searchRadius}
              aroundPrecision={DEFAULT_AROUND_PRECISION}
            />
          )}
          <SiteSearchInput />
          <div className={styles.flexContainer}>
            <Sidebar
              setSearchRadius={setSearchRadius}
              searchRadius={searchRadius}
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
              <SearchResults
                mobileMapIsCollapsed={isMapCollapsed}
                setAroundLatLng={setAroundLatLng}
              />
            </div>
          </div>
        </InstantSearch>
      </div>
    </>
  );
};
