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
import { createSavedSearch } from "models/SavedSearch";
import { getCurrentUser } from "models/User";
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
  query?: string | null;
  [key: string]: any;
}

/** Wrapper component that handles state management, URL parsing, and external API requests. */
export const SearchResultsPage = () => {
  const [cookies] = useCookies(["googtrans"]);
  const history = useHistory();
  const { search } = useLocation();
  const { authState, userLocation } = useAppContext();
  const [lastPush, setLastPush] = useState(Date.now());
  const [expandList, setExpandList] = useState(false);

  const [searchState, setSearchState] = useState<SearchState | null>(null);
  const [searchRadius, setSearchRadius] = useState(
    searchState?.configure?.aroundRadius ?? "all"
  );
  const [searchSaved, setSearchSaved] = useState(false);

  // In cases where we translate a query into English, we use this value
  // to represent the user's original, untranslated input. The untranslatedQuery
  // is displayed in the UI and stored in the URL params.
  // This untranslatedQuery value is also checked against when a new search is triggered
  // to determine if the user has input a different query (vs. merely selecting refinements),
  // in which case we need to call the translation API again
  const [untranslatedQuery, setUntranslatedQuery] = useState<string | null>(
    null
  );
  const [translatedQuery, setTranslatedQuery] = useState<string | null>(null);
  const [nonQuerySearchParams, setNonQuerySearchParams] = useState<SearchState>(
    {}
  );

  useEffect(() => {
    const qsParams = qs.parse(search.slice(1));
    setUntranslatedQuery(qsParams.query ? (qsParams.query as string) : "");
    delete qsParams.query;
    setNonQuerySearchParams(qsParams);
  }, [search]);

  useEffect(() => {
    if (untranslatedQuery === null) {
      return;
    }

    let queryLanguage = "en";
    // Google Translate determines translation source and target with a
    // "googtrans" cookie. If the cookie exists, we assume that the
    // the query should be translated into English prior to querying Algolia
    const translationCookie = cookies.googtrans;
    if (translationCookie) {
      [, queryLanguage] = translationCookie.split("/en/");
    }

    const emptyQuery = untranslatedQuery.length === 0;
    if (queryLanguage === "en" || emptyQuery) {
      setTranslatedQuery(untranslatedQuery);
    } else if (untranslatedQuery) {
      post("/api/translation/translate_text", {
        text: untranslatedQuery,
        source_language: queryLanguage,
      }).then((resp) =>
        resp.json().then((body) => {
          setTranslatedQuery(body.result as string);
        })
      );
    }
  }, [untranslatedQuery, cookies.googtrans]);

  let saveSearch = null;
  if (authState) {
    const authToken = authState.accessTokenObject.token;
    saveSearch = () => {
      if (!searchState) throw new Error("searchState not expected to be empty");

      // Parse aroundLatLng into separate lat/lng floats.
      let lat: number | null = null;
      let lng: number | null = null;
      const aroundLatLng: string | undefined =
        searchState.configure?.aroundLatLng;
      if (aroundLatLng) {
        const components = aroundLatLng.split(",");
        if (components.length !== 2)
          throw new Error(`Unexpected aroundLatLng format: ${aroundLatLng}`);
        lat = parseFloat(components[0]);
        lng = parseFloat(components[1]);
        if (Number.isNaN(lat))
          throw new Error(`lat parsed to a NaN: ${components[0]}`);
        if (Number.isNaN(lng))
          throw new Error(`lng parsed to a NaN: ${components[1]}`);
      }

      return getCurrentUser(authToken)
        .then((user) => {
          return createSavedSearch(
            {
              user_id: user.id,
              name: searchState.query || "",
              search: {
                eligibilities: searchState.refinementList.eligibilities ?? [],
                categories: searchState.refinementList.categories ?? [],
                lat,
                lng,
                query: searchState.query ?? "",
              },
            },
            authToken
          );
        })
        .then(() => setSearchSaved(true));
    };
  }

  useEffect(() => {
    setSearchState({ ...nonQuerySearchParams, query: translatedQuery });
  }, [translatedQuery, nonQuerySearchParams]);

  if (
    translatedQuery === null ||
    searchState === null ||
    userLocation === null
  ) {
    return <Loader />;
  }

  return (
    <InnerSearchResults
      history={history}
      userLocation={{ lat: userLocation.lat, lng: userLocation.lng }}
      lastPush={lastPush}
      setLastPush={setLastPush}
      expandList={expandList}
      setExpandList={setExpandList}
      searchState={searchState}
      searchRadius={searchRadius}
      setSearchRadius={setSearchRadius}
      untranslatedQuery={untranslatedQuery}
      searchSaved={searchSaved}
      saveSearch={saveSearch}
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
  searchSaved,
  saveSearch,
}: {
  history: any;
  userLocation: GeoCoordinates;
  lastPush: number;
  setLastPush: (time: number) => void;
  expandList: boolean;
  setExpandList: (listExpanded: boolean) => void;
  searchState: SearchState;
  searchRadius: string;
  setSearchRadius: (radius: string) => void;
  untranslatedQuery: string | undefined | null;
  searchSaved?: boolean;
  saveSearch?: (() => void) | null;
}) => {
  const [location, setLocation] = useState({
    lat: userLocation.lat,
    lng: userLocation.lng,
  });

  const onSearchStateChange = (nextSearchState: SearchState) => {
    const THRESHOLD = 700;
    const newPush = Date.now();
    setLastPush(newPush);
    const urlParams = {
      ...nextSearchState,
      // With our setup, the onSearchStateChange event only runs as a result of editing
      // refinements. It is not called when the user enters a new query in the search
      // input field. Thus, the query value will not have changed. However, of relevance to
      // non-English queries, the nextSearchState arg that's passed to this callback includes
      // the _translated_ query rather than the user's original untranslated input.
      // For various reasons, we want to urlParams query value to be the untranslated query.
      query: untranslatedQuery,
    };

    const newUrl = nextSearchState ? `search?${qs.stringify(urlParams)}` : "";
    if (lastPush && newPush - lastPush <= THRESHOLD) {
      history.replace(newUrl);
    } else {
      history.push(newUrl);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
        resultsTitle={untranslatedQuery ?? ""}
        expandList={expandList}
        setExpandList={setExpandList}
        searchSaved={searchSaved}
        saveSearch={saveSearch}
      />

      <InstantSearch
        searchClient={searchClient}
        indexName={`${config.ALGOLIA_INDEX_PREFIX}_services_search`}
        searchState={searchState}
        onSearchStateChange={onSearchStateChange}
        createURL={(state: any) => `search?${qs.stringify(state)}`}
      >
        <Configure
          aroundLatLng={`${location.lat}, ${location.lng}`}
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
              overlayMapWithSearchResults={expandList}
              setAroundLatLng={setLocation}
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
