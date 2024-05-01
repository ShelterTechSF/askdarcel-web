import React, { useState } from "react";
import qs from "qs";
import { useHistory } from "react-router-dom";

import { icon } from "assets";
import { Button } from "components/ui/inline/Button/Button";
import { coreCategories } from "pages/HomePage";
import { Checkbox } from "components/ui/inline/Checkbox/Checkbox";

import styles from "./NavigatorDashboard.module.scss";

interface SelectedCategories {
  [key: string]: boolean;
}
const initialSelectedCategories: SelectedCategories = {};
coreCategories.forEach((category) => {
  initialSelectedCategories[category.algoliaCategoryName] = false;
});

const AdvancedSearch = () => {
  const [advancedMode, setAdvancedMode] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(
    initialSelectedCategories
  );
  const history = useHistory();

  let searchValue = "";
  const submitSearch = () => {
    if (!advancedMode && !searchValue) return;

    const searchState: { [key: string]: unknown } = {
      refinementList: {
        categories: coreCategories.flatMap((c) => {
          if (selectedCategories[c.algoliaCategoryName]) {
            return c.algoliaCategoryName;
          }
          return [];
        }),
      },
    };

    if (searchValue) {
      searchState.query = searchValue;
    }

    const search = qs.stringify(searchState, { encodeValuesOnly: true });
    history.push(`/search?${search}`);
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
          <Button
            buttonType="submit"
            disabled={advancedMode}
            addClass={styles.searchButton}
          >
            Search
          </Button>
          <button
            type="button"
            className={`${styles.searchFilterButton} ${
              advancedMode ? styles.advancedMode : ""
            }`}
            onClick={() => setAdvancedMode(!advancedMode)}
          >
            <img
              src={icon(advancedMode ? "filter-white" : "filter-gray")}
              alt="Add filters to search"
            />
          </button>
        </div>
        {advancedMode && (
          <>
            <CategoryFilters
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
            <div className={styles.submitButtonRow}>
              <Button buttonType="submit" addClass={styles.submitButton}>
                Submit
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

const CategoryFilters = ({
  selectedCategories,
  setSelectedCategories,
}: {
  selectedCategories: SelectedCategories;
  setSelectedCategories: (updatedCategories: SelectedCategories) => void;
}) => {
  const handleCategoryClick = (categoryName: string) => {
    const newValue = !selectedCategories[categoryName];
    const updatedCategories = { ...selectedCategories };

    setSelectedCategories({
      ...updatedCategories,
      [categoryName]: newValue,
    });
  };

  return (
    <div className={styles.serviceFilters}>
      <p className={styles.serviceTypeHeader}>Service Type</p>
      <ul className={styles.serviceCheckboxList}>
        {coreCategories.map((c) => (
          <li key={c.algoliaCategoryName} className={styles.checkboxItem}>
            <Checkbox
              name={c.name}
              id={c.name}
              checked={selectedCategories[c.algoliaCategoryName]}
              onChange={() => handleCategoryClick(c.algoliaCategoryName)}
              addLabel
            />
          </li>
        ))}
      </ul>
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
