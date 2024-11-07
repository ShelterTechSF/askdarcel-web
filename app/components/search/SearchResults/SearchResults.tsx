import React, { useCallback } from "react";
import { SearchMap } from "components/search/SearchMap/SearchMap";
import { SearchResult } from "components/search/SearchResults/SearchResult";
import {
  TransformedSearchHit,
  transformSearchResults,
} from "models/SearchHits";
import {
  useInstantSearch,
  usePagination,
  useSearchBox,
} from "react-instantsearch";
import styles from "./SearchResults.module.scss";
import ClearSearchButton from "../Refinements/ClearSearchButton";
import { Loader } from "components/ui/Loader";
import ResultsPagination from "components/search/Pagination/ResultsPagination";

export enum SearchMapActions {
  SearchThisArea,
}

const SearchResults = ({
  mobileMapIsCollapsed,
}: {
  mobileMapIsCollapsed: boolean;
}) => {
  const { refine: refinePagination } = usePagination();
  const {
    // Results type is algoliasearchHelper.SearchResults<SearchHit>
    results: searchResults,
    status,
  } = useInstantSearch();
  const { query } = useSearchBox();

  const handleFirstResultFocus = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      node.focus();
    }
  }, []);

  const searchMapHitData = transformSearchResults(searchResults);

  const hasNoResults = searchMapHitData.nbHits === 0 && status === "idle" && (
    <Loader />
  );

  const NoResultsDisplay = () => (
    <div className={`${styles.noResultsMessage}`}>
      <div className={styles.noResultsText}>
        No results {query && `for ${` "${query}" `}`} found in your area.
        <br /> Try a different location, filter, or search term.
      </div>

      {query && <ClearSearchButton />}
    </div>
  );

  const searchResultsHeader = () => {
    return (
      <div className={styles.searchResultsHeader}>
        <h2>{searchResults.nbHits} results</h2>
        <ClearSearchButton />
      </div>
    );
  };

  const handleAction = (searchMapAction: SearchMapActions) => {
    switch (searchMapAction) {
      case SearchMapActions.SearchThisArea:
        return refinePagination(0);
    }
  };

  return (
    <div className={styles.searchResultsAndMapContainer}>
      <div
        className={`${styles.searchResultsContainer} ${
          mobileMapIsCollapsed ? styles.resultsPositionWhenMapCollapsed : ""
        }`}
      >
        <h2 className="sr-only">Search results</h2>
        {hasNoResults ? (
          <NoResultsDisplay />
        ) : (
          <>
            {searchResultsHeader()}
            {searchMapHitData.hits.map((hit: TransformedSearchHit, index) => (
              <SearchResult
                hit={hit}
                key={`${hit.id} - ${hit.name}`}
                ref={index === 0 ? handleFirstResultFocus : null}
              />
            ))}
            <div
              className={`${styles.paginationContainer} ${
                hasNoResults ? styles.hidePagination : ""
              }`}
            >
              <div className={styles.resultsPagination}>
                <ResultsPagination noResults={hasNoResults} />
              </div>
            </div>
          </>
        )}
      </div>
      <SearchMap
        hits={searchMapHitData.hits}
        mobileMapIsCollapsed={mobileMapIsCollapsed}
        handleSearchMapAction={handleAction}
      />
    </div>
  );
};

export default SearchResults;
