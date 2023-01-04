import React from 'react';

import { Checkbox } from 'components/ui/inline/Checkbox/Checkbox';

import {
  Eligibility,
  EligibilityGroup,
} from './ucsfEligibilitiesMap';

import styles from './Refinements.module.scss';

interface SelectedEligibilities {
  [key: string]: boolean;
}

export const EligibilityRefinements = ({
  resourceEligibilityGroups, selectedEligibilities, setSelectedEligibilities,
}: {
  resourceEligibilityGroups: EligibilityGroup[];
  selectedEligibilities: SelectedEligibilities;
  setSelectedEligibilities: (categories: SelectedEligibilities) => void;
}) => {
  const handleEligibilityClick = (
    eligibility: Eligibility,
    eligibilities: Eligibility[],
  ) => {
    const seeAllEligibilityItem = eligibilities.find(e => e.isSeeAll)!;
    const newValue = !selectedEligibilities[eligibility.checkedId];
    const updatedEligibilities = { ...selectedEligibilities, [eligibility.checkedId]: newValue };

    if (newValue) {
      if (eligibility.isSeeAll) {
        // If "See All" is target refinement, deselect all other eligibilities. This is done because
        // showing all services requires that we do not include any refinements in our query
        eligibilities.forEach(el => {
          updatedEligibilities[el.checkedId] = false;
        });
      } else {
        // If new refinement will be checked, uncheck "See All" box since now the query will include
        // refinements
        updatedEligibilities[seeAllEligibilityItem.checkedId] = false;
      }
    }

    setSelectedEligibilities({ ...updatedEligibilities, [eligibility.checkedId]: newValue });
  };

  return (
    <div className={styles.refinementsBox}>
      <div className={styles.refinementsBox_title}>Client Identity</div>
      <ol className={styles.refinementsLabels}>
        {resourceEligibilityGroups.map(eligibilityGroup => (
          <li key={eligibilityGroup.label} className={styles.listContainer}>
            <span className={styles.refinementsGroupLabel}>
              {eligibilityGroup.label}
            </span>
            <ul className={styles.refinementsList}>
              {eligibilityGroup.eligibilities.map(eligibility => (
                <li key={`${eligibilityGroup.label}-${eligibility.name}`}>
                  <Checkbox
                    onChange={() => handleEligibilityClick(
                      eligibility,
                      eligibilityGroup.eligibilities,
                    )}
                    name={eligibilityGroup.label}
                    id={`${eligibilityGroup.label}-${eligibility.name}`}
                    checked={selectedEligibilities[eligibility.checkedId] ?? false}
                  />
                  <label className={styles.refinementsLabel} htmlFor={`${eligibilityGroup.label}-${eligibility.name}`}>
                    {eligibility.alias ?? eligibility.name}
                  </label>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
};
