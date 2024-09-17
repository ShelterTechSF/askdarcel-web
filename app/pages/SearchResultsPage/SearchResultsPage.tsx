// TODO remove this when you have the infinite patience to deal with TS shenanigans
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Helmet } from "react-helmet-async";
import { liteClient } from "algoliasearch/lite";
import { InstantSearch, Configure } from "react-instantsearch";
import qs from "qs";

import { DEFAULT_AROUND_PRECISION, useAppContext, websiteConfig } from "utils";
import { translate } from "utils/DataService";

import { Loader } from "components/ui";
import SearchResults from "components/search/SearchResults/SearchResults";
import Sidebar from "components/search/Sidebar/Sidebar";
import { Header } from "components/search/Header/Header";
import { SiteSearchInput } from "components/ui/SiteSearchInput";
import config from "../../config";
import styles from "./SearchResultsPage.module.scss";
import type { UiState } from "instantsearch.js";

/* eslint-disable @typescript-eslint/no-unsafe-argument */
const searchClient = liteClient(
  config.ALGOLIA_APPLICATION_ID,
  config.ALGOLIA_READ_ONLY_API_KEY
);
/* eslint-enable @typescript-eslint/no-unsafe-argument */

const INDEX_NAME = `${config.ALGOLIA_INDEX_PREFIX}_services_search`;

/** Wrapper component that handles state management, URL parsing, and external API requests. */
export const SearchResultsPage = () => {
  const [cookies] = useCookies(["googtrans"]);
  const { search } = useLocation();
  const { userLocation } = useAppContext();
  const [isMapCollapsed, setIsMapCollapsed] = useState(false);

  const [searchState, setSearchState] = useState<UiState | null>(null);

  const [searchRadius, setSearchRadius] = useState(
    searchState?.configure?.aroundRadius ?? "all"
  );
  const [aroundLatLang, setAroundLatLng] = useState({
    lat: userLocation?.lat,
    lng: userLocation?.lng,
  });

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
  const [nonQuerySearchParams, setNonQuerySearchParams] = useState<UiState>({});

  useEffect(() => {
    const qsParams = qs.parse(search.slice(1));
    setUntranslatedQuery(
      qsParams[`${INDEX_NAME}.query}`]
        ? (qsParams[`${INDEX_NAME}.query}`] as string)
        : ""
    );
    delete qsParams["production_services_search[query]"];
    setNonQuerySearchParams(qsParams as UiState);
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
      translate(untranslatedQuery, queryLanguage).then((result) =>
        setTranslatedQuery(result)
      );
    }
  }, [untranslatedQuery, cookies.googtrans]);

  useEffect(() => {
    setSearchState({ ...nonQuerySearchParams, query: translatedQuery || "" });
  }, [translatedQuery, nonQuerySearchParams]);

  if (
    translatedQuery === null ||
    searchState === null ||
    userLocation === null
  ) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      <Helmet>
        <title>{`${searchState.query ?? "Services"} in San Francisco | ${
          websiteConfig.title
        }`}</title>
        <meta
          name="description"
          content={`A list of ${
            searchState.query ?? "services"
          } in San Francisco`}
        />
      </Helmet>

      <Header />

      <InstantSearch searchClient={searchClient} indexName={INDEX_NAME} routing>
        <Configure
          aroundLatLng={`${aroundLatLang.lat}, ${aroundLatLang.lng}`}
          aroundRadius={searchRadius}
          aroundPrecision={DEFAULT_AROUND_PRECISION}
        />
        <SiteSearchInput />
        <div className={styles.flexContainer}>
          <Sidebar
            setSearchRadius={setSearchRadius}
            searchRadius={searchRadius}
            isSearchResultsPage
            isMapCollapsed={isMapCollapsed}
            setIsMapCollapsed={setIsMapCollapsed}
          />

          <div className={styles.results}>
            <SearchResults
              mobileMapIsCollapsed={isMapCollapsed}
              setAroundLatLng={setAroundLatLng}
              searchQuery={untranslatedQuery}
            />
          </div>
        </div>
      </InstantSearch>
    </div>
  );
};
