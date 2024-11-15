import { Button } from "components/ui/inline/Button/Button";
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
      <Button
        iconName="fas fa-print"
        iconVariant="before"
        variant="secondary"
        size="lg"
        onClick={() => {
          window.print();
        }}
        addClass={`${styles.printAllBtn} ${styles.showBtn}`}
      >
        Print this page
      </Button>
    </div>
  );
};
