import React from "react";
import { Checkbox } from "components/ui/inline/Checkbox/Checkbox";
import { coreCategories } from "pages/HomePage";
import styles from "./CategoryFilters.module.scss";

export interface SelectedCategories {
  [key: string]: boolean;
}

export const CategoryFilters = ({
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
    <div className={styles.categoryFilters}>
      <p className={styles.categoryTypeHeader}>Service Type</p>
      <ul className={styles.categoryCheckboxList}>
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
