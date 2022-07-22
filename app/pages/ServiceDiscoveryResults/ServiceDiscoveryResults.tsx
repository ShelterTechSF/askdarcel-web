import React, { useState, useEffect } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, Configure } from 'react-instantsearch/dom';
import qs from 'qs';

import { match as Match, RouteComponentProps } from 'react-router-dom';

import * as dataService from 'utils/DataService';
import { useAppContext } from 'utils';

import { Loader } from 'components/ui';
import SearchResults from 'components/search/SearchResults/SearchResults';
import Sidebar from 'components/search/Sidebar/Sidebar';

import { useEligibilitiesForCategory, useSubcategoriesForCategory } from '../../hooks/APIHooks';
import config from '../../config';
import { CATEGORIES, ServiceCategory } from '../ServiceDiscoveryForm/constants';
import styles from './ServiceDiscoveryResults.module.scss';

type MatchParams = { categorySlug: string };
type RouterLocation = RouteComponentProps['location'];
type SearchState = {
  configure?: {
    aroundRadius?: string;
  };
};

/* eslint-disable @typescript-eslint/no-unsafe-argument */
const searchClient = algoliasearch(
  config.ALGOLIA_APPLICATION_ID,
  config.ALGOLIA_READ_ONLY_API_KEY,
);
/* eslint-enable @typescript-eslint/no-unsafe-argument */

const createURL = (state: SearchState) => `?${qs.stringify(state, { encodeValuesOnly: true })}`;
const searchStateToURL = (location: RouterLocation, searchState: SearchState) => (searchState
  ? `${location.pathname}${createURL(searchState)}` : ''
);
const urlToSearchState = (location: RouterLocation): SearchState => qs.parse(
  location.search.slice(1),
);

/** Wrapper component that handles state management, URL parsing, and external API requests. */
export function ServiceDiscoveryResults({
  history, location, match,
}: {
  history: RouteComponentProps['history'];
  location: RouteComponentProps['location'];
  match: Match<MatchParams>;
}) {
  const { categorySlug } = match.params;
  const category = CATEGORIES.find(c => c.slug === categorySlug);
  if (category === undefined) { throw new Error(`Unknown category slug ${categorySlug}`); }
  const [parentCategory, setParentCategory] = useState<ServiceCategory | null>(null);
  const eligibilities = useEligibilitiesForCategory(category.id);
  const subcategories = useSubcategoriesForCategory(category.id);
  const [searchState, setSearchState] = useState(urlToSearchState(location));
  const [expandList, setExpandList] = useState(false);
  const [searchRadius, setSearchRadius] = useState(searchState?.configure?.aroundRadius || 'all');
  const { userLocation } = useAppContext();

  const onSearchStateChange = (nextSearchState: SearchState) => {
    setSearchState(nextSearchState);
    history.push(searchStateToURL(location, nextSearchState), nextSearchState);
  };

  // TODO: Handle failure?
  useEffect(() => {
    dataService.get(`/api/categories/${category.id}`).then(({ category: serviceCategory }: { category: ServiceCategory }) => {
      setParentCategory(serviceCategory);
    });
  }, [category.id]);

  // TS compiler requires explict null type checks
  if (parentCategory !== null
      && eligibilities !== null
      && subcategories !== null
      && userLocation !== null) {
    return (
      <InnerServiceDiscoveryResults
        eligibilities={eligibilities}
        subcategories={subcategories}
        categoryName={category.name}
        algoliaCategoryName={parentCategory.name}
        searchState={searchState}
        onSearchStateChange={onSearchStateChange}
        searchRadius={searchRadius}
        setSearchRadius={setSearchRadius}
        expandList={expandList}
        setExpandList={setExpandList}
        userLatLng={`${userLocation.lat}, ${userLocation.lng}`}
      />
    );
  }

  return <Loader />;
}

/** Stateless inner component that just handles presentation. */
function InnerServiceDiscoveryResults({
  eligibilities, subcategories, categoryName, algoliaCategoryName, searchState,
  onSearchStateChange, searchRadius, setSearchRadius, expandList, setExpandList, userLatLng,
}: {
  eligibilities: object[];
  subcategories: ServiceCategory[];
  categoryName: string;
  algoliaCategoryName: string;
  searchState: SearchState;
  onSearchStateChange: (nextSearchState: SearchState) => void;
  searchRadius: string;
  setSearchRadius: (radius: string) => void;
  expandList: boolean;
  setExpandList: (_expandList: boolean) => void;
  userLatLng: string;
}) {
  const subcategoryNames = subcategories.map(c => c.name);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{categoryName}</h1>
        <div className={styles.mapListToggleContainer}>
          <button type="button" className={styles.mapListToggleBtn} onClick={() => setExpandList(true)}>
            <span className={`${styles.listIcon} ${expandList ? styles.activeView : ''}`} />
          </button>
          <button type="button" className={styles.mapListToggleBtn} onClick={() => setExpandList(false)}>
            <span className={`${styles.mapIcon} ${!expandList ? styles.activeView : ''}`} />
          </button>
        </div>
      </div>

      <InstantSearch
        searchClient={searchClient}
        indexName={`${config.ALGOLIA_INDEX_PREFIX}_services_search`}
        searchState={searchState}
        onSearchStateChange={onSearchStateChange}
      >

        <Configure filters={`categories:'${algoliaCategoryName}'`} aroundLatLng={userLatLng} aroundRadius={searchRadius} aroundPrecision={1600} />
        <div className={styles.flexContainer}>
          <Sidebar
            setSearchRadius={setSearchRadius}
            searchRadius={searchRadius}
            isSearchResultsPage={false}
            eligibilities={eligibilities}
            subcategories={subcategories}
            subcategoryNames={subcategoryNames}
          />

          <div className={styles.results}>
            <SearchResults
              expandList={expandList}
              setExpandList={setExpandList}
            />
          </div>
        </div>

      </InstantSearch>
    </div>
  );
}
