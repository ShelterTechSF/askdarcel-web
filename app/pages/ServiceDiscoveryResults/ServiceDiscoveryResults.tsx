import React, { useState, useEffect } from "react";
import algoliasearch from "algoliasearch/lite";
import { InstantSearch, Configure } from "react-instantsearch/dom";
import qs from "qs";
import { Helmet } from "react-helmet-async";

import { match as Match, RouteComponentProps } from "react-router-dom";

import * as dataService from "utils/DataService";
import { useAppContext, websiteConfig } from "utils";

import { Loader } from "components/ui";
import SearchResults from "components/search/SearchResults/SearchResults";
import Sidebar from "components/search/Sidebar/Sidebar";
import { Header } from "components/search/Header/Header";
import { Category } from "models/Meta";
import { SecondaryNavigationWrapper } from "components/navigation/SecondaryNavigationWrapper";
import { SearchHeaderSection } from "components/search/Header/SearchHeaderSection";

import {
  useEligibilitiesForCategory,
  useSubcategoriesForCategory,
} from "hooks/APIHooks";
import config from "../../config";
import { CATEGORIES, ServiceCategory } from "../constants";
import styles from "./ServiceDiscoveryResults.module.scss";

type MatchParams = { categorySlug: string };
type RouterLocation = RouteComponentProps["location"];
type SearchState = {
  configure?: {
    aroundRadius?: string;
  };
};

/* eslint-disable @typescript-eslint/no-unsafe-argument */
const searchClient = algoliasearch(
  config.ALGOLIA_APPLICATION_ID,
  config.ALGOLIA_READ_ONLY_API_KEY
);
/* eslint-enable @typescript-eslint/no-unsafe-argument */

const createURL = (state: SearchState) =>
  `?${qs.stringify(state, { encodeValuesOnly: true })}`;
const searchStateToURL = (location: RouterLocation, searchState: SearchState) =>
  searchState ? `${location.pathname}${createURL(searchState)}` : "";
const urlToSearchState = (location: RouterLocation): SearchState =>
  qs.parse(location.search.slice(1));

/** Wrapper component that handles state management, URL parsing, and external API requests. */
export const ServiceDiscoveryResults = ({
  history,
  location,
  match,
}: {
  history: RouteComponentProps["history"];
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
  const [searchState, setSearchState] = useState(urlToSearchState(location));
  const [isMapCollapsed, setIsMapCollapsed] = useState(false);
  const [searchRadius, setSearchRadius] = useState(
    searchState?.configure?.aroundRadius || "all"
  );
  const { userLocation } = useAppContext();

  const onSearchStateChange = (nextSearchState: SearchState) => {
    setSearchState(nextSearchState);
    history.push(searchStateToURL(location, nextSearchState), nextSearchState);
  };

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
    algoliaCategoryName !== null &&
    eligibilities !== null &&
    subcategories !== null &&
    userLocation !== null
  ) {
    return (
      <InnerServiceDiscoveryResults
        eligibilities={eligibilities}
        subcategories={subcategories}
        category={category}
        algoliaCategoryName={algoliaCategoryName}
        searchState={searchState}
        onSearchStateChange={onSearchStateChange}
        searchRadius={searchRadius}
        setSearchRadius={setSearchRadius}
        isMapCollapsed={isMapCollapsed}
        setIsMapCollapsed={setIsMapCollapsed}
        userLatLng={{ lat: userLocation.lat, lng: userLocation.lng }}
      />
    );
  }

  return <Loader />;
};

/** Stateless inner component that just handles presentation. */
const InnerServiceDiscoveryResults = ({
  eligibilities,
  subcategories,
  category,
  algoliaCategoryName,
  searchState,
  onSearchStateChange,
  searchRadius,
  setSearchRadius,
  isMapCollapsed,
  setIsMapCollapsed,
  userLatLng,
}: {
  eligibilities: object[];
  subcategories: Category[];
  category: ServiceCategory;
  algoliaCategoryName: string;
  searchState: SearchState;
  onSearchStateChange: (nextSearchState: SearchState) => void;
  searchRadius: string;
  setSearchRadius: (radius: string) => void;
  isMapCollapsed: boolean;
  setIsMapCollapsed: (_isMapCollapsed: boolean) => void;
  userLatLng: { lat: number; lng: number };
}) => {
  const [aroundLatLang, setAroundLatLng] = useState(userLatLng);
  const subcategoryNames = subcategories.map((c) => c.name);
  const { name: categoryName, sortAlgoliaSubcategoryRefinements } = category;

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
        <Header resultsTitle={categoryName} />

        <InstantSearch
          searchClient={searchClient}
          indexName={`${config.ALGOLIA_INDEX_PREFIX}_services_search`}
          searchState={searchState}
          onSearchStateChange={onSearchStateChange}
        >
          {category.disableGeoLocation ? (
            <Configure filters={`categories:'${algoliaCategoryName}'`} />
          ) : (
            <Configure
              filters={`categories:'${algoliaCategoryName}'`}
              aroundLatLng={`${aroundLatLang.lat}, ${aroundLatLang.lng}`}
              aroundRadius={searchRadius}
              aroundPrecision={1600}
            />
          )}
          <div className={styles.flexContainer}>
            <Sidebar
              setSearchRadius={setSearchRadius}
              searchRadius={searchRadius}
              isSearchResultsPage={false}
              eligibilities={eligibilities}
              subcategories={subcategories}
              subcategoryNames={subcategoryNames}
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
