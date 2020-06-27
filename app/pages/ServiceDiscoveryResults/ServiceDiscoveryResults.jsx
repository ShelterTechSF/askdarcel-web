import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { InstantSearch, Configure } from 'react-instantsearch/dom';
import _ from 'lodash';
import qs from 'qs';

import config from '../../config';
import Loader from '../../components/ui/Loader';
import * as dataService from '../../utils/DataService';
import { CATEGORIES } from '../../components/ui/Modal/ServiceDiscoveryModal/constants';
import { useEligibilitiesForCategory, useSubcategoriesForCategory } from '../../hooks/APIHooks';

import ClearAllFilters from './ClearAllFilters';
import OpenNowFilter from './OpenNowFilter';
import RefinementListFilter from './RefinementListFilter';
import SearchResults from './SearchResults/SearchResults';
import styles from './ServiceDiscoveryResults.scss';


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
}) => {
  const subcategoryNames = subcategories.map(c => c.name);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{categoryName}</h1>
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
          <div className={styles.sidebar}>
            <div className={styles.filterResourcesTitle}>Filter Resources</div>
            <ClearAllFilters />
            <div className={styles.filterGroup}>
              <div className={styles.filterTitle}>Availability</div>
              <OpenNowFilter attribute="open_times" />
            </div>

            {!!eligibilities.length && (
              <div className={styles.filterGroup}>
                <div className={styles.filterTitle}>Eligibilities</div>
                <RefinementListFilter
                  attribute="eligibilities"
                  transformItems={items => _.sortBy(items, ['label'])}
                />
              </div>
            )}

            {!!subcategories.length && (
              <div className={styles.filterGroup}>
                <div className={styles.filterTitle}>Categories</div>
                <RefinementListFilter
                  attribute="categories"
                  transformItems={items => {
                    // Note that in Algolia, the categories attribute is for all
                    // categories, but for this page, we only want to display
                    // the specific subcategories of the target category, not
                    // all categories that the services are tagged with.
                    // We filter down the categories list from Algolia to just
                    // the subcategories.
                    const subcategoryItems = items.filter(
                      item => subcategoryNames.includes(item.label),
                    );
                    return _.sortBy(subcategoryItems, ['label']);
                  }}
                />
              </div>
            )}

          </div>
          <div className={styles.results}>
            <SearchResults />
          </div>
        </div>
      </InstantSearch>
    </div>
  );
};
