import React, { useEffect, useRef, useState } from "react";
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

  const [searchState, setSearchState] = useState<SearchState | null>(null);
  const [searchRadius, setSearchRadius] = useState(
    searchState?.configure?.aroundRadius ?? "all"
  );

  // In cases where we translate a query into English, we use this ref
  // to represent the user's original, untranslated input. The untranslatedQuery
  // is displayed in the UI and stored in the URL params.
  // This untranslatedQuery value is also checked against when a new search is triggered
  // to determine if the user has input a different query (vs. merely selecting refinements),
  // in which case we need to call the translation API again
  const untranslatedQuery = useRef<string | null | undefined>(null);
  const translatedQuery = useRef(null);

  useEffect(() => {
    const urlParams: SearchState = qs.parse(search.slice(1));
    const { query }: SearchState = urlParams;
    let queryLanguage = "en";

    // Google Translate determines translation source and target with a
    // "googtrans" cookie. If the cookie exists, we assume that the
    // the query should be translated into English prior to querying Algolia
    const translationCookie = cookies.googtrans;
    if (translationCookie) {
      [, queryLanguage] = translationCookie.split("/en/");
    }

    const isNewQuery = untranslatedQuery.current !== urlParams.query;
    const queryNeedsToBeTranslated = isNewQuery && queryLanguage !== "en";

    if (queryNeedsToBeTranslated) {
      untranslatedQuery.current = urlParams.query;
      post("/api/translation/translate_text", {
        text: query,
        source_language: queryLanguage,
      }).then((resp) =>
        resp.json().then((body) => {
          translatedQuery.current = body.result;
          // The query has now been translated to English. Pass the English translation to
          // the searchState.
          setSearchState({
            ...urlParams,
            query: body.result,
          });
        })
      );
    } else if (translatedQuery.current) {
      // The query was translated during a prior search, but the user has (de)-selected refinements,
      // which have triggered the current effect. Pass the new refinements to the searchState with the
      // already translated query rather than the untranslated query contained in the urlParams
      setSearchState({
        ...urlParams,
        query: translatedQuery.current,
      });
    } else {
      // A simple English language search
      setSearchState(urlParams);
    }
  }, [search, cookies.googtrans, searchState?.query]);

  if (searchState === null) {
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
      untranslatedQuery={untranslatedQuery.current}
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
  untranslatedQuery: string | undefined | null;
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
        onSearchStateChange={(nextSearchState: SearchState) => {
          const THRESHOLD = 700;
          const newPush = Date.now();
          setLastPush(newPush);
          const urlParams = {
            ...nextSearchState,
            // With our setup, the onSearchStateChange event only runs as a result of editing
            // refinements. It is not called when the user enters a new query in the search
            // input field. Thus, the query value will not have changed. However, of relavance to
            // non-English queries, the nextSearchState arg that's passed to this callback includes
            // the the _translated_ query rather than the user's original untranslated input.
            // For various reasons, we want to urlParams query value to be the untranslated query.
            query: untranslatedQuery ?? nextSearchState.query,
          };

          const newUrl = nextSearchState
            ? `search?${qs.stringify(urlParams)}`
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
