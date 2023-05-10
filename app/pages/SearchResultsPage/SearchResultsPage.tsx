import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Helmet } from "react-helmet-async";
import algoliasearch from "algoliasearch/lite";
import { InstantSearch, Configure, SearchBox } from "react-instantsearch/dom";
import qs, { ParsedQs } from "qs";

import { GeoCoordinates, useAppContext, whiteLabel } from "utils";
import { post } from "utils/DataService";

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
  const [cookies] = useCookies(["googtrans"]);
  const history = useHistory();
  const { search } = useLocation();
  const { userLocation } = useAppContext();
  const [lastPush, setLastPush] = useState(Date.now());
  const [expandList, setExpandList] = useState(false);
  const [searchState, setSearchState] = useState<SearchState>({});
  const [searchRadius, setSearchRadius] = useState(
    searchState?.configure?.aroundRadius ?? "all"
  );
  // In cases where we translate a non-English query into English (to query Alglolia), we use this
  // state var to cache the user's orginal, untranslated query to display on the results page
  const [untranslatedQuery, setUntranslatedQuery] = useState("");
  const [searchStateResolved, setSearchStateResolved] = useState(false);

  useEffect(() => {
    const queryParams = qs.parse(search.slice(1));
    const { query } = queryParams;
    setUntranslatedQuery(query as string);

    // Google Translate determines translation source and target with a
    // "googtrans" cookie. If the cookie exists, we assume that the
    // the query should be translated into English prior to querying Algolia
    const translationCookie = cookies.googtrans;

    if (query && translationCookie) {
      const [, targetLanguage] = translationCookie.split("/en/") as string;
      if (targetLanguage !== "en") {
        post("/api/translation/translate_text", {
          text: query,
          target_language: targetLanguage,
        }).then((resp) =>
          resp.json().then((body) => {
            setSearchState({
              ...queryParams,
              query: body.result,
            });
            setSearchStateResolved(true);
          })
        );
      }
    } else {
      setSearchState(queryParams);
      setSearchStateResolved(true);
    }
  }, [cookies.googtrans, search, untranslatedQuery]);

  if (!searchStateResolved) {
    // In some case(s) -- e.g. when waiting to receive a translation from the API -- the search state
    // is set asynchronously; thus, we want to wait until the search state resolves. Otherwise,
    // our code will query Algolia twice - first with an empty string and secondly with the translated
    // search query, which can cause a UI flash as well as the needless first call
    return null;
  }

  return (
    <InnerSearchResults
      history={history}
      userLocation={userLocation}
      lastPush={lastPush}
      setLastPush={setLastPush}
      expandList={expandList}
      setExpandList={setExpandList}
      searchState={searchState}
      searchRadius={searchRadius}
      setSearchRadius={setSearchRadius}
      untranslatedQuery={untranslatedQuery}
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
  untranslatedQuery,
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
  untranslatedQuery: string;
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
        translateResultsTitle={false}
        resultsTitle={untranslatedQuery || ""}
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
