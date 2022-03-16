import React, { useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch, Configure
} from 'react-instantsearch/dom';
import qs, { ParsedQs } from 'qs';

import { GeoCoordinates, useAppContext } from 'utils';
import config from '../../config';

import SearchResults from 'components/search/SearchResults/SearchResults';
import Sidebar from 'components/search/Sidebar/Sidebar';

import styles from './SearchResults.module.scss';

const searchClient = algoliasearch(
  config.ALGOLIA_APPLICATION_ID,
  config.ALGOLIA_READ_ONLY_API_KEY,
);

/** Wrapper component that handles state management, URL parsing, and external API requests. */
export const SearchResultsPage = () => {
  const { userLocation } = useAppContext();
  const [lastPush, setLastPush] = useState(Date.now());
  const { search } = useLocation();
  const [expandList, setExpandList] = useState(false);
  const searchState = useMemo(() => qs.parse(search.slice(1)), [search]);

  return (
    <InnerSearchReslts
      history={useHistory()}
      userLocation={userLocation}
      lastPush={lastPush}
      setLastPush={setLastPush}
      expandList={expandList}
      setExpandList={setExpandList}
      searchState={searchState}
    />
  );
}

/** Stateless inner component that just handles presentation. */
const InnerSearchReslts = ({
  history, userLocation, lastPush, setLastPush, expandList, setExpandList, searchState
}: {
  history: any
  userLocation: GeoCoordinates,
  lastPush: number,
  setLastPush: Function,
  expandList: boolean,
  setExpandList: Function,
  searchState: ParsedQs
}) => {
  const searchResultsProps = {setExpandList, expandList};


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{searchState.query}</h1>
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
        {/* <div className={styles.searchBox}>
          todo: part of the next stage of multiple location development
          <SearchBox />
        </div> */}
        <div className={styles.flexContainer}>
          <Sidebar
            isSearchResultsPage
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
