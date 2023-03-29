import React, { useMemo, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import algoliasearch from "algoliasearch/lite";
import { InstantSearch, Configure, SearchBox } from "react-instantsearch/dom";
import qs, { ParsedQs } from "qs";

import { GeoCoordinates, useAppContext, whiteLabel } from "utils";

import { Loader } from "components/ui";
import SearchResults from "components/search/SearchResults/SearchResults";
import Sidebar from "components/search/Sidebar/Sidebar";
import { Header } from "components/search/Header/Header";
import config from "../../config";
import styles from "./SearchResultsPage.module.scss";

/* eslint-disable @typescript-eslint/no-unsafe-argument */
const searchClient = algoliasearch(
  config.ALGOLIA_APPLICATION_ID,
  config.ALGOLIA_READ_ONLY_API_KEY
);
/* eslint-enable @typescript-eslint/no-unsafe-argument */

interface ConfigureState {
  aroundRadius?: string;
  [key: string]: any;
}

interface SearchState extends ParsedQs {
  configure?: ConfigureState;
  query?: string;
  [key: string]: any;
}

/** Wrapper component that handles state management, URL parsing, and external API requests. */
export const SearchResultsPage = () => {
  const { userLocation } = useAppContext();
  const [lastPush, setLastPush] = useState(Date.now());
  const { search } = useLocation();
  const [expandList, setExpandList] = useState(false);

  const searchState: SearchState = useMemo(
    () => qs.parse(search.slice(1)),
    [search]
  );
  const [searchRadius, setSearchRadius] = useState(
    searchState?.configure?.aroundRadius ?? "all"
  );

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
  history,
  userLocation,
  lastPush,
  setLastPush,
  expandList,
  setExpandList,
  searchState,
  searchRadius,
  setSearchRadius,
}: {
  history: any;
  userLocation: GeoCoordinates | null;
  lastPush: number;
  setLastPush: (time: number) => void;
  expandList: boolean;
  setExpandList: (listExpanded: boolean) => void;
  searchState: SearchState;
  searchRadius: string;
  setSearchRadius: (radius: string) => void;
}) => {
  if (userLocation === null) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      <Helmet>
        <title>{`${searchState.query ?? "Services"} in San Francisco | ${
          whiteLabel.title
        }`}</title>
        <meta
          name="description"
          content={`A list of ${
            searchState.query ?? "services"
          } in San Francisco`}
        />
      </Helmet>
      <Header
        resultsTitle={searchState.query || ""}
        expandList={expandList}
        setExpandList={setExpandList}
      />

      <InstantSearch
        searchClient={searchClient}
        indexName={`${config.ALGOLIA_INDEX_PREFIX}_services_search`}
        searchState={searchState}
        onSearchStateChange={(nextSearchState: any) => {
          const THRESHOLD = 700;
          const newPush = Date.now();
          setLastPush(newPush);
          const newUrl = nextSearchState
            ? `search?${qs.stringify(nextSearchState)}`
            : "";
          if (lastPush && newPush - lastPush <= THRESHOLD) {
            history.replace(newUrl);
          } else {
            history.push(newUrl);
          }
        }}
        createURL={(state: any) => `search?${qs.stringify(state)}`}
      >
        <Configure
          aroundLatLng={`${userLocation.lat}, ${userLocation.lng}`}
          aroundRadius={searchRadius}
          aroundPrecision={1600}
        />
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
};
