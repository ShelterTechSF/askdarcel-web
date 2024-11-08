import React from "react";
import styles from "components/search/SearchResults/SearchResults.module.scss";
import ClearSearchButton from "components/search/Refinements/ClearSearchButton";

export const NoSearchResultsDisplay = ({ query }: { query: string | null }) => (
  <div className={`${styles.noResultsMessage}`}>
    <div className={styles.noResultsText}>
      No results {query && `for ${` "${query}" `}`} found in your area.
      <br /> Try a different location, filter, or search term.
    </div>
    {query && <ClearSearchButton />}
  </div>
);
