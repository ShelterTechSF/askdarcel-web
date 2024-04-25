import React from "react";
import qs from "qs";
import { useHistory } from "react-router-dom";

import { icon } from "assets";
import { Button } from "components/ui/inline/Button/Button";

import styles from "./NavigatorDashboard.module.scss";

const AdvancedSearch = () => {
  const history = useHistory();
  let searchValue = "";
  const submitSearch = () => {
    if (searchValue) {
      const query = qs.stringify({ query: searchValue });
      history.push(`/search?${query}`);
    }
  };

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
      <form
        className={styles.searchBoxForm}
        onSubmit={(evt) => {
          evt.preventDefault();
          submitSearch();
        }}
      >
        <div className={styles.searchInputContainer}>
          <input
            type="text"
            placeholder="Emergency Shelter"
            className={styles.searchInput}
            onChange={(evt) => {
              searchValue = evt.target.value;
            }}
          />
        </div>
        <Button buttonType="submit" addClass={styles.searchButton}>
          Search
        </Button>
        <button type="button" className={styles.searchFilterButton}>
          <img src={icon("filter-gray")} alt="Add filters to search" />
        </button>
      </form>
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
