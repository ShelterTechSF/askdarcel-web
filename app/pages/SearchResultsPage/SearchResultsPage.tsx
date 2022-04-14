import React, { useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch, Configure, SearchBox,
} from 'react-instantsearch/dom';
import qs, { ParsedQs } from 'qs';

import { GeoCoordinates, useAppContext } from 'utils';

import SearchResults from 'components/search/SearchResults/SearchResults';
import Sidebar from 'components/search/Sidebar/Sidebar';

import config from '../../config';
import styles from './SearchResultsPage.module.scss';

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

  // Todo: I'm not sure if this is the greatest solution; querying the searchState
  // for the configure.aroundRadius property causes a TS type warning unless I
  // define the interfaces below
  interface ConfigureState {
    aroundRadius?: string;
    [key: string]: any;
  }

  interface SearchState {
    configure?: ConfigureState;
    [key: string]: any;
  }

  const searchState: SearchState = useMemo(() => qs.parse(search.slice(1)), [search]);
  const [searchRadius, setSearchRadius] = useState(searchState?.configure?.aroundRadius || 'all');

  return (
    <InnerSearchResults
      history={useHistory()}
      userLocation={userLocation}
      lastPush={lastPush}
      setLastPush={setLastPush}
      expandList={expandList}
      setExpandList={setExpandList}
      searchState={searchState}
      searchRadius={searchRadius}
      setSearchRadius={setSearchRadius}
    />
  );
};

/** Stateless inner component that just handles presentation. */
const InnerSearchResults = ({
  history, userLocation, lastPush, setLastPush, expandList, setExpandList, searchState,
  searchRadius, setSearchRadius,
}: {
  history: any;
  userLocation: GeoCoordinates;
  lastPush: number;
  setLastPush: (time: number) => void;
  expandList: boolean;
  setExpandList: (listExpanded: boolean) => void;
  searchState: ParsedQs;
  searchRadius: string;
  setSearchRadius: (radius: any) => void;
}) => (
  <div className={styles.container}>
    <div className={styles.header}>
      <h1 className={styles.title}>{searchState.query}</h1>
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

      <Configure aroundLatLng={`${userLocation.lat}, ${userLocation.lng}`} aroundRadius={searchRadius} />
      {/* <div className={styles.searchBox}>
        todo: part of the next stage of multiple location development
        <SearchBox />
      </div> */}
      <div className={styles.flexContainer}>
        <Sidebar
          setSearchRadius={setSearchRadius}
          searchRadius={searchRadius}
          isSearchResultsPage
        />

        <div className={styles.results}>
          <SearchResults
            expandList={expandList}
            setExpandList={setExpandList}
          />
        </div>
      </div>
      <div className={styles.hiddenSearchBox}>
        {/* The SearchBox component needs to be insde the InstantSearch component for the
        search query term to be passed to InstantSearch internals but it can be hidden */}
        <SearchBox />
      </div>
    </InstantSearch>
  </div>
);
