import React from "react";
import { useSearchBox } from "react-instantsearch-core";
import styles from "./SearchHeaderSection.module.scss";

/**
 * Renders mobile and desktop views for Listings navigation
 */
export const SearchHeaderSection = ({
  descriptionText,
}: {
  descriptionText: string;
}) => {
  const { query } = useSearchBox();
  return (
    <div className={styles.searchHeaderContainer}>
      <div className={styles.searchHeaderContainerLeft}>
        {query ? (
          <h1>Search results for "{query}"</h1>
        ) : (
          <h1>Search results</h1>
        )}
      </div>
      <span>{descriptionText}</span>
    </div>
  );
};
