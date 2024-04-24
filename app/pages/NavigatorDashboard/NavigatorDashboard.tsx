import React from "react";
import { icon } from "assets";
import { Button } from "components/ui/inline/Button/Button";
import styles from "./NavigatorDashboard.module.scss";


const AdvancedSearch = () => {
  return (
    <div className={styles.advancedSearchContainer}>
      <h1 className={styles.header}>Hi, Navigator :)</h1>
      <p className={styles.blurb}>
        Please use the search bar to find resources for the individuals
        you&apos;re assisting. You can enter keywords such as
        &ldquo;shelter,&ldquo; &ldquo;food assistance,&ldquo; or
        &ldquo;employment support,&ldquo; to discover relevant programs and
        services.
      </p>
      <div className={styles.searchBoxContainer}>
        <div className={styles.searchInputContainer}>
          <input
            type="text"
            placeholder="Emergency Shelter"
            className={styles.searchInput}
          />
        </div>
        <Button addClass={styles.searchButton}>Search</Button>
        <button type="button" className={styles.searchFilterButton}>
          <img src={icon("filter-gray")} alt="Add filters to search" />
        </button>
      </div>
    </div>
  );
};

export const NavigatorDashboard = () => {
  return (
    <div>
      <AdvancedSearch />
    </div>
  );
};
