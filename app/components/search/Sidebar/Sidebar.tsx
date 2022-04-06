import React, { useState } from 'react';

import { eligibilitiesMapping, categoriesMapping } from 'utils/refinementMappings';
import ClearAllFilters from 'components/search/Refinements/ClearAllFilters';
import OpenNowFilter from 'components/search/Refinements/OpenNowFilter';
import RefinementListFilter from 'components/search/Refinements/RefinementListFilter';
import FacetRefinementList from 'components/search/Refinements/FacetRefinementList';

import filtersIcon from 'assets/img/filters-icon.png';
import closeIcon from 'assets/img/ic-close.svg';
import styles from './Sidebar.module.scss';

const Sidebar = ({
  isSearchResultsPage, eligibilities = [], subcategories = [], subcategoryNames = [],
}: {
  isSearchResultsPage: boolean;
  eligibilities?: Array<object>;
  subcategories?: Array<object>;
  subcategoryNames?: Array<string>;
}) => {
  const [filterMenuVisible, setfilterMenuVisible] = useState(false);
  let categoryRefinementJsx = null;
  let eligibilityRefinementJsx = null;
  const orderByLabel = (a:{label: string}, b:{label: string}) => a.label.localeCompare(b.label);

  // Currently, the Search Results Page uses generic categories/eligibilities while the
  // Service Results Page uses COVID-specific categories. This logic determines which
  // of these to use as based on the isSearchResultsPage value
  if (isSearchResultsPage) {
    categoryRefinementJsx = <FacetRefinementList attribute="categories" limit={100} mapping={categoriesMapping} />;
    eligibilityRefinementJsx = <FacetRefinementList attribute="eligibilities" limit={100} mapping={eligibilitiesMapping} />;
  } else {
    // Service Results Page
    if (eligibilities.length) {
      eligibilityRefinementJsx = <RefinementListFilter attribute="eligibilities" transformItems={(items) => items.sort(orderByLabel)} />;
    }
    if (subcategories.length) {
      categoryRefinementJsx = (
        <RefinementListFilter
          attribute="categories"
          transformItems={(items: any) => {
            return items
              .filter((item: any) => subcategoryNames.includes(item.label))
              .sort(orderByLabel)
          }}
        />
      );
    }
  }

  return (
    <div className={styles.sidebar}>
      <div className={styles.filtersIconContainer}>
        <button
          className={styles.filterBtn}
          onClick={() => setfilterMenuVisible(!filterMenuVisible)}
          type="button"
        >
          <img
            src={filtersIcon}
            alt="search filters"
            className={styles.filtersIcon}
          />
          <span>Filters</span>
        </button>
      </div>
      <div className={`${styles.filtersContainer} ${filterMenuVisible ? styles.showFilters : ''}`}>
        <div className={styles.closeBtnContainer}>
          <button
            className={styles.filterBtn}
            onClick={() => setfilterMenuVisible(!filterMenuVisible)}
            type="button"
          >
            <img
              src={closeIcon}
              alt="close filters"
              className={styles.closeIcon}
            />
          </button>
        </div>
        <div className={styles.filterResourcesTitle}>Filters</div>
        <ClearAllFilters />
        <div className={styles.filterGroup}>
          <div className={styles.filterTitle}>Availability</div>
          <OpenNowFilter attribute="open_times" />
        </div>

        <div className={styles.filterGroup}>
          <div className={styles.filterTitle}>Eligibilities</div>
          {eligibilityRefinementJsx}
        </div>

        <div className={styles.filterGroup}>
          <div className={styles.filterTitle}>Categories</div>
          {categoryRefinementJsx}
        </div>

      </div>
    </div>
  );
};

export default Sidebar;
