import React, { useState, useRef } from "react";
import type { Category } from "models/Meta";
import {
  eligibilitiesMapping,
  categoriesMapping,
} from "utils/refinementMappings";
import ClearAllFilters from "components/search/Refinements/ClearAllFilters";
import OpenNowFilter from "components/search/Refinements/OpenNowFilter";
import RefinementListFilter from "components/search/Refinements/RefinementListFilter";
import FacetRefinementList from "components/search/Refinements/FacetRefinementList";
import { Button } from "components/ui/inline/Button/Button";
import useClickOutside from "../../../hooks/MenuHooks";
import MobileMapToggleButtons from "./MobileMapToggleButtons";
import styles from "./Sidebar.module.scss";

const Sidebar = ({
  setSearchRadius,
  searchRadius,
  isSearchResultsPage,
  eligibilities = [],
  subcategories = [],
  subcategoryNames = [],
  sortAlgoliaSubcategoryRefinements = false,
  isMapCollapsed,
  setIsMapCollapsed,
}: {
  setSearchRadius: (radius: string) => void;
  searchRadius: string;
  isSearchResultsPage: boolean;
  eligibilities?: object[];
  subcategories?: Category[];
  subcategoryNames?: string[];
  sortAlgoliaSubcategoryRefinements?: boolean;
  isMapCollapsed: boolean;
  setIsMapCollapsed: (_isMapCollapsed: boolean) => void;
}) => {
  const [filterMenuVisible, setfilterMenuVisible] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  useClickOutside(
    filterMenuRef,
    () => setfilterMenuVisible(false),
    filterMenuVisible
  );

  let categoryRefinementJsx: React.ReactElement | null = null;
  let eligibilityRefinementJsx: React.ReactElement | null = null;
  const orderByLabel = (a: { label: string }, b: { label: string }) =>
    a.label.localeCompare(b.label);

  const orderByPriorityRanking = (
    a: { label: string },
    b: { label: string }
  ) => {
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
  };

  const onChangeValue = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setSearchRadius(evt.target.value);
  };

  // Currently, the Search Results Page uses generic categories/eligibilities while the
  // Service Results Page uses COVID-specific categories. This logic determines which
  // of these to use as based on the isSearchResultsPage value
  if (isSearchResultsPage) {
    categoryRefinementJsx = (
      <FacetRefinementList
        attribute="categories"
        limit={100}
        mapping={categoriesMapping}
      />
    );
    eligibilityRefinementJsx = (
      <FacetRefinementList
        attribute="eligibilities"
        limit={100}
        mapping={eligibilitiesMapping}
      />
    );
  } else {
    // Service Results Page
    if (eligibilities.length) {
      eligibilityRefinementJsx = (
        <RefinementListFilter
          attribute="eligibilities"
          limit={100}
          transformItems={(items: { label: string }[]) =>
            items.sort(orderByLabel)
          }
        />
      );
    }
    if (subcategories.length) {
      categoryRefinementJsx = (
        <RefinementListFilter
          attribute="categories"
          /*
            Algolia returns all categories that the union of returned services are tagged with.
            The transformItems method filters out any of these categories that are not children
            of the parent tile category (these children are members of the subcategoryNames
            array). Since the number of tagged categories returned by Algolia can be very large,
            we need to set an artificially high limit to ensure that the returned set contains
            the desired subcategories; these are the initial subcategories displayed to the user
            as checkboxes in the ServiceDiscoveryForm view.
          */
          limit={100}
          transformItems={(items: { label: string }[]) =>
            items
              .filter(({ label }) => subcategoryNames.includes(label))
              .sort(
                sortAlgoliaSubcategoryRefinements
                  ? orderByPriorityRanking
                  : orderByLabel
              )
          }
        />
      );
    }
  }

  return (
    <div className={styles.sidebar}>
      <div className={styles.filtersButtonContainer} aria-hidden>
        <Button
          variant="linkBlue"
          onClick={() => setfilterMenuVisible(!filterMenuVisible)}
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
              onClick={() => setfilterMenuVisible(!filterMenuVisible)}
              size="lg"
            >
              Close
            </Button>
          </span>
        </div>
        <h2 className={styles.filterResourcesTitleDesktop}>Filter Resources</h2>
        <ClearAllFilters setSearchRadius={setSearchRadius} />
        <div className={styles.filterGroup}>
          <div className={styles.filterTitle}>Availability</div>
          <OpenNowFilter attribute="open_times" />
        </div>

        <div
          className={`${styles.filterGroup} ${
            eligibilityRefinementJsx ? "" : styles.hideFilterGroup
          } `}
        >
          <h2 className={styles.filterTitle}>Eligibilities</h2>
          {eligibilityRefinementJsx}
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

        <div className={styles.filterGroup}>
          <h2 className={styles.filterTitle}>Distance</h2>
          <label className={styles.checkBox}>
            Within 4 blocks
            <input
              type="radio"
              name="searchRadius"
              onChange={onChangeValue}
              value="400"
              checked={searchRadius === "400"}
              className={styles.refinementInput}
            />
          </label>
          <label className={styles.checkBox}>
            Walking distance (1 mi.)
            <input
              type="radio"
              name="searchRadius"
              onChange={onChangeValue}
              value="1600"
              checked={searchRadius === "1600"}
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
              checked={searchRadius === "4828"}
              className={styles.refinementInput}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
