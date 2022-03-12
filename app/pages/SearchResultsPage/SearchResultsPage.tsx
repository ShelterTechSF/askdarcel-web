import React, { useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch, Configure, SearchBox, Pagination,
} from 'react-instantsearch/dom';
import qs from 'qs';

import { useAppContext } from 'utils';
import config from '../../config';

import SearchResults from '../../components/search/SearchResults/SearchResults';
import Sidebar from '../../components/search/Sidebar/Sidebar';

import styles from './SearchResults.module.scss';
import '../../components/search/ResultsPagination.scss';


const searchClient = algoliasearch(
  config.ALGOLIA_APPLICATION_ID,
  config.ALGOLIA_READ_ONLY_API_KEY,
);

export const SearchResultsPage = () => <InnerServiceDiscoveryResults />;

/** Stateless inner component that just handles presentation. */
const InnerServiceDiscoveryResults = () => {
  const history = useHistory();
  const { search } = useLocation();
  const { userLocation } = useAppContext();
  const [lastPush, setLastPush] = useState(Date.now());
  const searchState = useMemo(() => qs.parse(search.slice(1)), [search]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{searchState.query}</h1>
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

          <Sidebar
            isSearchPage
          />

          <div className={styles.results}>
            <SearchResults
              props
            />
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
