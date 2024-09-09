import React from "react";
import styles from "./SearchHeaderSection.module.scss";

/**
 * Renders mobile and desktop views for Listings navigation
 */
export const SearchHeaderSection = ({
  descriptionText,
}: {
  descriptionText: string;
}) => (
  <div className={styles.searchHeaderContainer}>
    <div className={styles.searchHeaderContainerLeft}>
      <h1 className={styles.title}>Services</h1>
    </div>
    <span>{descriptionText}</span>
  </div>
);
