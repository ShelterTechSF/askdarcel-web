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
  const [filterActive, setFilterActive] = useState(false);
  const transformItems = (items: any): any => items.sort((a:{label: string},
    b:{label: string}) => a.label.localeCompare(b.label));
  let categoryRefinementJsx = null;
  let eligibilityRefinementJsx = null;

  // Currently, the Search Results Page uses generic categories/eligibilities while the
  // Service Results Page uses COVID-specific categories. This logic determines which
  // of these to use as based on the isSearchResultsPage value
  if (isSearchResultsPage) {
    categoryRefinementJsx = <FacetRefinementList attribute="categories" limit={100} mapping={categoriesMapping} />;
    eligibilityRefinementJsx = <FacetRefinementList attribute="eligibilities" limit={100} mapping={eligibilitiesMapping} />;
  } else {
    // Service Results Page
    if (eligibilities.length) {
      eligibilityRefinementJsx = <RefinementListFilter attribute="eligibilities" transformItems={transformItems} />;
    }
    if (subcategories.length) {
      categoryRefinementJsx = (
        <RefinementListFilter
          attribute="categories"
          transformItems={(items: any) => {
            const subcategoryItems = items.filter((item: any) => subcategoryNames
              .includes(item.label));
            return transformItems(subcategoryItems);
          }}
        />
      );
    }
  }

  return (
    <div className={`${styles.sidebar} ${filterActive ? styles.showFilters : ''}`}>
      <div className={`${styles.filtersIconContainer} ${filterActive ? styles.hideIcon : ''}`}>
        <button
          className={`${styles.filterBtn} ${filterActive ? styles.active : ''}`}
          onClick={() => setFilterActive(!filterActive)}
          type="button"
        >
          <img
            src={filtersIcon}
            alt="search filters"
            className={styles.filtersIcon}
          />
          <span>Filters</span>
          <img
            src={closeIcon}
            alt="close filters"
            className={styles.closeIcon}
          />
        </button>
      </div>
      <div className={`${styles.filtersContainer} ${filterActive ? styles.showFilters : ''}`}>
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
