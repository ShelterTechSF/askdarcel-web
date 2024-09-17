import React, { useState, useEffect } from "react";
import { match as Match, RouteComponentProps } from "react-router-dom";
import * as dataService from "utils/DataService";
import { DEFAULT_AROUND_PRECISION, useAppContext } from "utils";
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
import { CATEGORIES, ServiceCategory } from "../constants";
import styles from "./ServiceDiscoveryResults.module.scss";
import { Configure } from "react-instantsearch-core";

type MatchParams = { categorySlug: string };

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
  const [isMapCollapsed, setIsMapCollapsed] = useState(false);
  const { userLocation } = useAppContext();
  const { aroundUserLocationRadius, aroundLatLng } = useAppContext();

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
        <Header currentCategory={categoryName} />
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
            <SearchResults mobileMapIsCollapsed={isMapCollapsed} />
          </div>
        </div>
      </div>
    </>
  );
};
