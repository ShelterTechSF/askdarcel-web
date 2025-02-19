import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  our415EligibilitiesMapping,
  mapSFSGApiEligibilitiesToOur415ByConfig,
} from "utils/refinementMappings";
import ClearAllFilters from "components/SearchAndBrowse/Refinements/ClearAllFilters";
import OpenNowFilter from "components/SearchAndBrowse/Refinements/OpenNowFilter";
import BrowseRefinementList from "components/SearchAndBrowse/Refinements/BrowseRefinementList";
import SearchRefinementList from "components/SearchAndBrowse/Refinements/SearchRefinementList";
import { Button } from "components/ui/inline/Button/Button";
import {
  DEFAULT_AROUND_PRECISION,
  useAppContext,
  useAppContextUpdater,
} from "utils";
import useClickOutside from "../../../hooks/MenuHooks";
import MobileMapToggleButtons from "./MobileMapToggleButtons";
import styles from "./Sidebar.module.scss";
import { RefinementListItem } from "instantsearch.js/es/connectors/refinement-list/connectRefinementList";
import classNames from "classnames";

const Sidebar = ({
  isSearchResultsPage,
  eligibilities,
  subcategoryNames = [],
  sortAlgoliaSubcategoryRefinements = false,
  isMapCollapsed,
  setIsMapCollapsed,
}: {
  isSearchResultsPage: boolean;
  eligibilities?: object[] | null;
  subcategoryNames?: string[];
  sortAlgoliaSubcategoryRefinements?: boolean;
  isMapCollapsed: boolean;
  setIsMapCollapsed: (_isMapCollapsed: boolean) => void;
}) => {
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement>(null);
  const { aroundUserLocationRadius, userLocation } = useAppContext();
  const { setAroundRadius } = useAppContextUpdater();

  useClickOutside(
    filterMenuRef,
    () => setFilterMenuVisible(false),
    filterMenuVisible
  );

  useEffect(() => {
    if (filterMenuVisible) {
      document.body.classList.add("lock-scroll");
    } else {
      document.body.classList.remove("lock-scroll");
    }
  }, [filterMenuVisible]);

  let categoryRefinementJsx: React.ReactElement | null = null;
  let eligibilityRefinementJsx: React.ReactElement | null = null;
  const orderByLabel = (a: { label: string }, b: { label: string }) =>
    a.label.localeCompare(b.label);

  const orderByPriorityRanking = useCallback(
    (a: { label: string }, b: { label: string }) => {
      if (!subcategoryNames) {
        // noop
        return 0;
      }
      // Our API has the ability to sort subcategories using the "child_priority_rank" on the
      // CategoryRelationship table. In cases where we want to sort our sidebar categories
      // following this order, we can use this sorting function, which sorts the categories
      // that we receive from Algolia using the order that we get from the API.
      const priorityA = subcategoryNames.indexOf(a.label);
      const priorityB = subcategoryNames.indexOf(b.label);

      // If an element in the data returned from Algolia does not exist in the API's ordered array
      // (i.e., Algolia is out of sync with our API), move the element to the back of the list.
      if (priorityA < 0) return 1;
      if (priorityB < 0) return -1;

      return priorityA - priorityB;
    },
    [subcategoryNames]
  );

  const onChangeValue = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const aroundRadius =
      evt.target.value === "all" ? "all" : Number(evt.target.value);
    setAroundRadius(aroundRadius);
  };

  const refinementItemTransform = useCallback(
    (items: RefinementListItem[]) =>
      items
        .filter(({ label }: { label: string }) =>
          subcategoryNames.includes(label)
        )
        .sort(
          sortAlgoliaSubcategoryRefinements
            ? orderByPriorityRanking
            : orderByLabel
        ),
    [
      orderByPriorityRanking,
      sortAlgoliaSubcategoryRefinements,
      subcategoryNames,
    ]
  );

  if (isSearchResultsPage) {
    eligibilityRefinementJsx = (
      <SearchRefinementList
        attribute="eligibilities"
        mapping={our415EligibilitiesMapping}
      />
    );
  } else {
    if (eligibilities?.length) {
      eligibilityRefinementJsx = (
        <BrowseRefinementList
          attribute="eligibilities"
          transform={(items: RefinementListItem[]) =>
            mapSFSGApiEligibilitiesToOur415ByConfig(
              items,
              our415EligibilitiesMapping
            )
          }
        />
      );
    }
    if (subcategoryNames?.length) {
      categoryRefinementJsx = (
        <BrowseRefinementList
          attribute="categories"
          // The number of tagged categories returned by Algolia can be very large.
          // We set an artificially high limit to attempt capturing all the subcategories
          // so that the returned set contain the desired subcategories; these are the initial subcategories displayed
          // to the user as checkboxes in the ServiceDiscoveryForm view.

          // Algolia returns all categories of the union of returned services.
          // We filter out any of these categories that are not children of the selected top level
          // category returned from the api
          // (`/api/categories/subcategories?id=${categoryID}`).
          transform={refinementItemTransform}
        />
      );
    }
  }

  return (
    <div className={classNames(styles.sidebar, "no-print")}>
      <div className={styles.filtersButtonContainer} aria-hidden>
        <Button
          variant="linkBlue"
          onClick={() => setFilterMenuVisible(!filterMenuVisible)}
          iconName="sliders"
          iconVariant="before"
          mobileFullWidth={false}
          size="lg"
        >
          Filters
        </Button>
        <MobileMapToggleButtons
          isMapCollapsed={isMapCollapsed}
          setIsMapCollapsed={setIsMapCollapsed}
        />
      </div>

      <div
        ref={filterMenuRef}
        className={`${styles.filtersContainer} ${
          filterMenuVisible ? styles.showFilters : ""
        }`}
      >
        <div className={styles.filterResourcesHeaderMobile}>
          <h2 className={styles.filterResourcesTitle}>Filters</h2>
          <span className={styles.filterResourcesCloseButton}>
            <Button
              variant="linkBlue"
              mobileFullWidth={false}
              onClick={() => setFilterMenuVisible(!filterMenuVisible)}
              size="lg"
            >
              Close
            </Button>
          </span>
        </div>

        <h2 className={styles.filterResourcesTitleDesktop}>Filter Resources</h2>
        <ClearAllFilters />
        <div className={styles.filterGroupContainer}>
          <div className={styles.filterGroup}>
            <div className={styles.filterTitle}>Availability</div>
            <OpenNowFilter />
          </div>
          {!isSearchResultsPage && (
            <div
              className={`${styles.filterGroup} ${
                categoryRefinementJsx ? "" : styles.hideFilterGroup
              }`}
            >
              <h2 className={styles.filterTitle}>Subcategories</h2>
              {categoryRefinementJsx}
            </div>
          )}
          <div
            className={`${styles.filterGroup} ${
              eligibilityRefinementJsx ? "" : styles.hideFilterGroup
            } `}
          >
            <h2 className={styles.filterTitle}>Eligibilities</h2>
            {eligibilityRefinementJsx}
          </div>

          {userLocation.inSanFrancisco && (
            <div className={styles.filterGroup}>
              <h2 className={styles.filterTitle}>Distance</h2>
              <label className={styles.checkBox}>
                Within 4 blocks
                <input
                  type="radio"
                  name="searchRadius"
                  onChange={onChangeValue}
                  value="400"
                  checked={aroundUserLocationRadius === 400}
                  className={styles.refinementInput}
                />
              </label>
              <label className={styles.checkBox}>
                Walking distance (1 mi.)
                <input
                  type="radio"
                  name="searchRadius"
                  onChange={onChangeValue}
                  value={DEFAULT_AROUND_PRECISION}
                  checked={
                    aroundUserLocationRadius === DEFAULT_AROUND_PRECISION
                  }
                  className={styles.refinementInput}
                />
              </label>
              <label className={styles.checkBox}>
                Biking distance (3 mi.)
                <input
                  type="radio"
                  name="searchRadius"
                  onChange={onChangeValue}
                  value="4828"
                  checked={aroundUserLocationRadius === 4828}
                  className={styles.refinementInput}
                />
              </label>
              <label className={styles.checkBox}>
                Full map area
                <input
                  type="radio"
                  name="searchRadius"
                  onChange={onChangeValue}
                  value="all"
                  checked={aroundUserLocationRadius === "all"}
                  className={styles.refinementInput}
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
