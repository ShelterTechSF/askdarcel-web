import React from 'react';

import { Checkbox } from 'components/ui/inline/Checkbox/Checkbox';

import styles from './Refinements.module.scss';

interface SubcategoryRefinement {
  name: string;
  id: number;
}

interface SelectedSubcategories {
  [key: number]: boolean;
}

const seeAllPseudoId = -1;

export const SubcategoryRefinements = ({
  subcategories, selectedSubcategories,
  setSelectedSubcategories,
}: {
  subcategories: SubcategoryRefinement[];
  selectedSubcategories: SelectedSubcategories;
  setSelectedSubcategories: (categories: SelectedSubcategories) => void;
}) => {
  // Add generic "See All" element to subcategory array if it is not there yet
  if (!subcategories[0] || subcategories[0].id !== seeAllPseudoId) {
    subcategories.unshift({ id: seeAllPseudoId, name: 'See All' });
  }

  const handleSubcategoryClick = (targetSubcategoryId: number) => {
    const seeAllIsTargetElement = targetSubcategoryId === seeAllPseudoId;
    const newValue = !selectedSubcategories[targetSubcategoryId];
    const updatedSubcategories = { ...selectedSubcategories };

    if (newValue) {
      if (seeAllIsTargetElement) {
        // If "See All" is target refinement, deselect all other subcategories. This is done because
        // showing all services requires that we do not include any refinements in our query
        subcategories.forEach(category => {
          updatedSubcategories[category.id] = false;
        });
      } else {
        // If new refinement will be checked, uncheck "See All" box since now the query will include
        // refinements
        updatedSubcategories[seeAllPseudoId] = false;
      }
    }

    setSelectedSubcategories({ ...updatedSubcategories, [targetSubcategoryId]: newValue });
  };

  return (
    <div className={styles.refinementsBox}>
      <div className={styles.refinementsBox_title}>Service Type</div>

      <ul className={styles.refinementsList}>
        {subcategories.map(item => (
          <li key={item.name}>
            <Checkbox
              onChange={() => handleSubcategoryClick(item.id)}
              name="serviceTypes"
              id={item.name}
              checked={selectedSubcategories[item.id] || false}
            />
            <label className={styles.refinementsLabel} htmlFor={item.name}>
              {item.name}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};
