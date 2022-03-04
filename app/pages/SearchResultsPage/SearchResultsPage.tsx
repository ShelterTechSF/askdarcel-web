import React, { useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, Configure, SearchBox, Pagination } from 'react-instantsearch/dom';
import qs from 'qs';

import { useAppContext } from 'utils';
import SearchResultsContainer from '../../components/search/SearchResultsContainer';
import config from '../../config';

import ClearAllFilters from '../ServiceDiscoveryResults/ClearAllFilters';
import OpenNowFilter from '../ServiceDiscoveryResults/OpenNowFilter';
import RefinementListFilter from '../ServiceDiscoveryResults/RefinementListFilter';
import SearchResults from '../ServiceDiscoveryResults/SearchResults/SearchResults';

import filtersIcon from '../../assets/img/filters-icon.png';
import styles from './SearchResults.module.scss';
import '../../components/search/ResultsPagination.scss';
import '../../components/search/Filtering.scss';


const searchClient = algoliasearch(
  config.ALGOLIA_APPLICATION_ID,
  config.ALGOLIA_READ_ONLY_API_KEY,
);

export const SearchResultsPage = () => {
  return (
    <InnerServiceDiscoveryResults/>
  );
};

/** Stateless inner component that just handles presentation. */
const InnerServiceDiscoveryResults = () => {
  const history = useHistory();
  const { search } = useLocation();
  const { userLocation } = useAppContext();
  const [lastPush, setLastPush] = useState(Date.now());
  const [filterActive, setFilterActive] = useState(false);
  const searchState = useMemo(() => qs.parse(search.slice(1)), [search]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{}</h1>
      </div>
      <InstantSearch
        searchClient={searchClient}
        indexName={`${config.ALGOLIA_INDEX_PREFIX}_services_search`}
        searchState={searchState}
        onSearchStateChange={(nextSearchState: any) => {
          const THRESHOLD = 700;
          const newPush = Date.now();
          setLastPush(newPush);
          const newUrl = nextSearchState ? `search?${qs.stringify(nextSearchState)}` : '';
          if (lastPush && newPush - lastPush <= THRESHOLD) {
            history.replace(newUrl);
          } else {
            history.push(newUrl);
          }
        }}
        createURL={(state: any) => `search?${qs.stringify(state)}`}
      >
        {userLocation ? (
          <Configure aroundLatLng={`${userLocation.lat}, ${userLocation.lng}`} />
        ) : (
          <Configure aroundLatLngViaIP aroundRadius="all" />
        )}
        <div className={styles.searchBox}>
          <SearchBox />
        </div>
        <div className={styles.flexContainer}>
          <div className={styles.sidebar}>
            <div className={styles.filterButtonContainer}>
              <img
                src={filtersIcon}
                alt="filters icon"
                className="filters-icon"
              />
              <button
                className={`refine-btn ${filterActive ? 'active' : ''}`}
                onClick={() => setFilterActive(!filterActive)}
                type="button"
              >
                Filters
              </button>
            </div>
            <div className={styles.filterResourcesTitle}>Filter Resources</div>
            <div className={`styles.filtersContainer ${filterActive ? 'showFilters' : ''}`}>
              <ClearAllFilters />
              <div className={styles.filterGroup}>
                <div className={styles.filterTitle}>Availability</div>
                <OpenNowFilter attribute="open_times" />
              </div>

              <div className={styles.filterGroup}>
                <div className={styles.filterTitle}>Eligibilities</div>
                <RefinementListFilter
                  attribute="eligibilities"
                  transformItems={items => items.sort((a:{label: string} ,b:{label: string}) => a.label.localeCompare(b.label))}
                />
              </div>

              <div className={styles.filterGroup}>
                <div className={styles.filterTitle}>Categories</div>
                <RefinementListFilter
                  attribute="categories"
                  transformItems={items => items.sort((a:{label: string} ,b:{label: string}) => a.label.localeCompare(b.label))}
                />
              </div>
            </div>
          </div>

          <div className={styles.results}>
            <SearchResults />
          </div>
        </div>
        <div className="results-pagination">
            <Pagination
              padding={2}
              showLast={false}
              showFirst={false}
              translations={{
                previous: 'Prev',
                next: 'Next',
              }}
            />
          </div>
      </InstantSearch>
    </div>
  );
};
