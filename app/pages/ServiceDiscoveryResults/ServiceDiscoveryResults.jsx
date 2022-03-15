import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { InstantSearch, Configure } from 'react-instantsearch/dom';
import qs from 'qs';

import config from '../../config';
import { Loader } from '../../components/ui';
import * as dataService from '../../utils/DataService';
import { CATEGORIES } from '../ServiceDiscoveryForm/constants';
import { useEligibilitiesForCategory, useSubcategoriesForCategory } from '../../hooks/APIHooks';

import SearchResults from '../../components/search/SearchResults/SearchResults';
import Sidebar from '../../components/search/Sidebar/Sidebar';

import styles from './ServiceDiscoveryResults.module.scss';

const createURL = state => `?${qs.stringify(state, { encodeValuesOnly: true })}`;

const searchStateToURL = (location, searchState) => (searchState ? `${location.pathname}${createURL(searchState)}` : '');

const urlToSearchState = location => qs.parse(location.search.slice(1));


/** Wrapper component that handles state management, URL parsing, and external API requests. */
const ServiceDiscoveryResults = ({ history, location, match }) => {
  const { categorySlug } = match.params;
  const category = CATEGORIES.find(c => c.slug === categorySlug);
  if (category === undefined) { throw new Error(`Unknown category slug ${categorySlug}`); }
  const [parentCategory, setParentCategory] = useState(null);
  const eligibilities = useEligibilitiesForCategory(category.id);
  const subcategories = useSubcategoriesForCategory(category.id);
  const [searchState, setSearchState] = useState(urlToSearchState(location));
  const [expandList, setExpandList] = useState(false);

  const onSearchStateChange = nextSearchState => {
    setSearchState(nextSearchState);
    history.push(searchStateToURL(location, nextSearchState), nextSearchState);
  };

  // TODO: Handle failure?
  useEffect(() => {
    dataService.get(`/api/categories/${category.id}`).then(response => {
      setParentCategory(response.category);
    });
  }, [category.id]);

  const isLoading = (parentCategory === null)
    || (eligibilities === null)
    || (subcategories === null);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <InnerServiceDiscoveryResults
      eligibilities={eligibilities}
      subcategories={subcategories}
      categoryName={category.name}
      algoliaCategoryName={parentCategory.name}
      searchState={searchState}
      onSearchStateChange={onSearchStateChange}
      expandList={expandList}
      setExpandList={setExpandList}
    />
  );
};
ServiceDiscoveryResults.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      categorySlug: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ServiceDiscoveryResults;


/** Stateless inner component that just handles presentation. */
const InnerServiceDiscoveryResults = ({
  eligibilities,
  subcategories,
  categoryName,
  algoliaCategoryName,
  searchState,
  onSearchStateChange,
  expandList,
  setExpandList
}) => {
  const subcategoryNames = subcategories.map(c => c.name);
  const searchResultsProps = {setExpandList, expandList};

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{categoryName}</h1>
        <div className={styles.mapListToggler}>
          <span
            className={`${styles.listIcon} ${expandList ? styles.activeView : ''}`}
            role="button"
            tabIndex={0}
            aria-label="list icon"
            onClick={() => setExpandList(true)}
          />
          <span
            className={`${styles.mapIcon} ${!expandList ? styles.activeView : ''}`}
            role="button"
            tabIndex={0}
            aria-label="map icon"
            onClick={() => setExpandList(false)}
          />
        </div>
      </div>
      <InstantSearch
        appId={config.ALGOLIA_APPLICATION_ID}
        apiKey={config.ALGOLIA_READ_ONLY_API_KEY}
        indexName={`${config.ALGOLIA_INDEX_PREFIX}_services_search`}
        searchState={searchState}
        onSearchStateChange={onSearchStateChange}
      >
        <Configure filters={`categories:'${algoliaCategoryName}'`} />
        <div className={styles.flexContainer}>
          <Sidebar
            isSearchResultsPage={false}
            eligibilities={eligibilities}
            subcategories={subcategories}
            subcategoryNames={subcategoryNames}
          />

          <div className={styles.results}>
          <SearchResults
              props
              {...searchResultsProps}
            />
          </div>
        </div>
      </InstantSearch>
    </div>
  );
};
