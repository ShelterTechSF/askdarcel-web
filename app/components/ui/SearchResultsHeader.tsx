import React, { ReactNode } from "react";
import styles from "components/search/SearchResults/SearchResults.module.scss";

/**
 * Layout component for the header above the search results list that allows for
 * flexible composition of child components.
 */
export const SearchResultsHeader = ({ children }: { children: ReactNode }) => (
  <div className={styles.searchResultsHeader}>{children}</div>
);
