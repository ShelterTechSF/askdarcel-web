import React, { useState } from 'react';

import { eligibilitiesMapping, categoriesMapping } from 'utils/refinementMappings';
import ClearAllFilters from 'components/search/Refinements/ClearAllFilters';
import OpenNowFilter from 'components/search/Refinements/OpenNowFilter';
import RefinementListFilter from 'components/search/Refinements/RefinementListFilter';
import FacetRefinementList from 'components/search/Refinements/FacetRefinementList';

import filtersIcon from 'assets/img/filters-icon.png';
import styles from './Sidebar.module.scss';
import 'components/search/Refinements/Filtering.scss';

const Sidebar = ({
  isSearchPage, eligibilities = [], subcategories = [], subcategoryNames = [],
}: {
  isSearchPage: boolean; eligibilities?: any; subcategories?: any; subcategoryNames?: Array<string>;
}) => {
  const [filterActive, setFilterActive] = useState(false);
  const transformItems = (items: any): any => items.sort((a:{label: string},
    b:{label: string}) => a.label.localeCompare(b.label));

  let categoryRefinementJsx = null;
  let eligibilityRefinementJsx = null;
  if (isSearchPage) {
    categoryRefinementJsx = <FacetRefinementList attribute="categories" limit={100} mapping={categoriesMapping} />;
    eligibilityRefinementJsx = <FacetRefinementList attribute="eligibilities" limit={100} mapping={eligibilitiesMapping} />;
  } else {
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
    <div className={styles.sidebar}>
      <div className={styles.filterIconContainer}>
        <img
          src={filtersIcon}
          alt="filters icon"
          className={styles.filterIcon}
        />
        <button
          className={`${styles.refineBtn} ${filterActive ? 'active' : ''}`}
          onClick={() => setFilterActive(!filterActive)}
          type="button"
        >
          Filters
        </button>
      </div>
      <div className={`${styles.filtersContainer} ${filterActive ? styles.showFilters : ''}`}>
        <div className={styles.filterResourcesTitle}>Filter Resources</div>
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
