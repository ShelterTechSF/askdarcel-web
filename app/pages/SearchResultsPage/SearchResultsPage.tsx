import React, { useState } from "react";
import SearchResults from "components/search/SearchResults/SearchResults";
import Sidebar from "components/search/Sidebar/Sidebar";
import { Header } from "components/search/Header/Header";
import styles from "./SearchResultsPage.module.scss";
import { DEFAULT_AROUND_PRECISION, useAppContext } from "utils";
import { Configure } from "react-instantsearch-core";
import classNames from "classnames";

// NOTE: The .searchResultsPage is added plain so that it can be targeted by print-specific css
export const SearchResultsPage = () => {
  const [isMapCollapsed, setIsMapCollapsed] = useState(false);
  const { aroundUserLocationRadius, aroundLatLng } = useAppContext();

  return (
    <div className={classNames(styles.container, "searchResultsPage")}>
      <Configure
        aroundLatLng={aroundLatLng}
        aroundRadius={aroundUserLocationRadius}
        aroundPrecision={DEFAULT_AROUND_PRECISION}
      />

      <div className={styles.flexContainer}>
        <Sidebar
          isSearchResultsPage
          isMapCollapsed={isMapCollapsed}
          setIsMapCollapsed={setIsMapCollapsed}
        />

        <div className={styles.results}>
          <SearchResults mobileMapIsCollapsed={isMapCollapsed} />
        </div>
      </div>
    </div>
  );
};
