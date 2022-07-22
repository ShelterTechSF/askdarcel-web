import React, { useState } from 'react';

import { eligibilitiesMapping, categoriesMapping } from 'utils/refinementMappings';
import ClearAllFilters from 'components/search/Refinements/ClearAllFilters';
import OpenNowFilter from 'components/search/Refinements/OpenNowFilter';
import RefinementListFilter from 'components/search/Refinements/RefinementListFilter';
import FacetRefinementList from 'components/search/Refinements/FacetRefinementList';

import filtersIcon from 'assets/img/filters-icon.png';
import styles from './Sidebar.module.scss';

function Sidebar({
  setSearchRadius, searchRadius, isSearchResultsPage,
  eligibilities = [], subcategories = [], subcategoryNames = [],
}: {
  setSearchRadius: (radius: any) => void;
  searchRadius: string;
  isSearchResultsPage: boolean;
  eligibilities?: object[];
  subcategories?: object[];
  subcategoryNames?: string[];
}) {
  const [filterMenuVisible, setfilterMenuVisible] = useState(false);
  let categoryRefinementJsx = null;
  let eligibilityRefinementJsx = null;
  const orderByLabel = (a:{label: string}, b:{label: string}) => a.label.localeCompare(b.label);
  const onChangeValue = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setSearchRadius(evt.target.value);
  };

  // Currently, the Search Results Page uses generic categories/eligibilities while the
  // Service Results Page uses COVID-specific categories. This logic determines which
  // of these to use as based on the isSearchResultsPage value
  if (isSearchResultsPage) {
    categoryRefinementJsx = <FacetRefinementList attribute="categories" limit={100} mapping={categoriesMapping} />;
    eligibilityRefinementJsx = <FacetRefinementList attribute="eligibilities" limit={100} mapping={eligibilitiesMapping} />;
  } else {
    // Service Results Page
    if (eligibilities.length) {
      eligibilityRefinementJsx = <RefinementListFilter attribute="eligibilities" transformItems={items => items.sort(orderByLabel)} />;
    }
    if (subcategories.length) {
      categoryRefinementJsx = (
        <RefinementListFilter
          attribute="categories"
          transformItems={(items: any) => items
            .filter(({ label }: { label: string }) => subcategoryNames.includes(label))
            .sort(orderByLabel)}
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
        <div className={styles.filterResourcesHeaderMobile}>
          <span className={styles.filterResourcesTitle}>Filters</span>
          <button
            className={`${styles.filterBtn} ${styles.filterResourcesBtn}`}
            onClick={() => setfilterMenuVisible(!filterMenuVisible)}
            type="button"
          >
            Close
          </button>
        </div>
        <span className={styles.filterResourcesTitleDesktop}>Filter Resources</span>
        <ClearAllFilters setSearchRadius={setSearchRadius} />
        <div className={styles.filterGroup}>
          <div className={styles.filterTitle}>Availability</div>
          <OpenNowFilter attribute="open_times" />
        </div>

        <div className={`${styles.filterGroup} ${eligibilityRefinementJsx ? '' : styles.hideFilterGroup} `}>
          <div className={styles.filterTitle}>Eligibilities</div>
          {eligibilityRefinementJsx}
        </div>

        <div className={`${styles.filterGroup} ${categoryRefinementJsx ? '' : styles.hideFilterGroup}`}>
          <div className={styles.filterTitle}>Categories</div>
          {categoryRefinementJsx}
        </div>

        <div className={styles.filterGroup}>
          <div className={styles.filterTitle}>Distance</div>
          <label className={styles.checkBox}>
            Within 4 blocks
            <input type="radio" name="searchRadius" onChange={onChangeValue} value="400" checked={searchRadius === '400'} className={styles.refinementInput} />
          </label>
          <label className={styles.checkBox}>
            Walking distance (1 mi.)
            <input type="radio" name="searchRadius" onChange={onChangeValue} value="1600" checked={searchRadius === '1600'} className={styles.refinementInput} />
          </label>
          <label className={styles.checkBox}>
            Biking distance (3 mi.)
            <input type="radio" name="searchRadius" onChange={onChangeValue} value="4828" checked={searchRadius === '4828'} className={styles.refinementInput} />
          </label>
        </div>

      </div>
    </div>
  );
}

export default Sidebar;
