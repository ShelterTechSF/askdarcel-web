import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import Checkbox from 'components/ui/inline/Checkbox';
import TileButton from 'components/ui/inline/TileButton';
import styles from './UcsfClientEligibilityPage.module.scss';

// import { useEligibilitiesForCategory } from '../../hooks/APIHooks';

// Todo: This is dummy data for development. It will be replaced by data returned by API request(s)
// Todo: Will "See all" be blue; See open figma question
const clientEligibilitiesList = [
  { label: 'Age and Dependents', eligibilities: [{ checked: false, name: 'See all' }, { checked: false, name: 'Under 18' }, { checked: false, name: 'I am a single adult and need shelter' }] },
  { label: 'Gender Identity', eligibilities: [{ checked: false, name: 'See all' }, { checked: false, name: 'Woman' }, { checked: false, name: 'Man' }, { checked: false, name: 'Transgender' }] },
  { label: 'Health Related', eligibilities: [{ checked: false, name: 'See all' }, { checked: false, name: 'HIV' }, { checked: false, name: 'Dual Diagnosis' }] },
];

export const UcsfClientEligibilityPage = () => {
  const history = useHistory();

  /**
   * Todo: The below is a general sketch of how we will fetch eligibility data using the category
   * IDs of the selected UCSF resources. Before we can do this, UCSF resources in our DB will need
   * to have associated eligibilities and category IDs

    interface resourceListItem {
      id: string;
      name: string;
      icon: string;
      checked: boolean;
    }

    // const location = useLocation();
    interface stateType {
      selectedResources: resourceListItem[];
    }

    const { state } = useLocation<stateType>();
    const selectedResources = state.selectedResources;
    const resourceEligibilities: object[] = [];

    selectedResources.forEach((resource) => {
      const eligibilities = useEligibilitiesForCategory(resource.id) || [];
      resourceEligibilities.push(...eligibilities);
    });
  */

  const goToResourceResults = () => {
    // Todo: We will need to alter the Service Discovery Results file to honor requests
    // that can include more than one resource (e.g. substance abuse AND mental health)
    // before successfully navigating to the suggested-resources page
    alert('Navigate to target resources');
    // history.push('/suggested-resources', {selectedResources: selectedResources});
  };

  const backToResourceSelection = () => {
    history.push('/');
  };

  return (
    <div className={styles.ucsfHomePage}>
      <h2 className={styles.title}>
        Step 2: Can you tell us more about your client and their needs?
      </h2>
      <div className={styles.eligibilitiesContainer}>
        <ClientEligibilities />
        <div className={styles.eligibilitiesBtns}>
          <TileButton
            text="Back"
            size="medium"
            onClick={backToResourceSelection}
          />
          <TileButton
            text="Next: Service Capacity"
            size="large"
            onClick={goToResourceResults}
            addClass={styles.goToResultsBtn}
          />
        </div>
      </div>
    </div>
  );
};

const ClientEligibilities = () => {
  const [eligibilityList, setEligibilityList] = useState(clientEligibilitiesList);
  const updateCheckedEligibilities = (evt: React.ChangeEvent<HTMLInputElement>, label: string) => {
    const newList = eligibilityList.map(eligibilityItem => {
      if (eligibilityItem.label === label) {
        const updatedEligibilities = eligibilityItem.eligibilities.map(eligibility => {
          if (eligibility.name === evt.target.name) {
            const updatedEligibility = {
              ...eligibility,
              checked: !eligibility.checked,
            };

            return updatedEligibility;
          }

          return eligibility;
        });

        const updatedItem = {
          ...eligibilityItem,
          eligibilities: updatedEligibilities,
        };

        return updatedItem;
      }

      return eligibilityItem;
    });

    setEligibilityList(newList);
  };

  return (
    <div className={styles.eligibilitiesBox}>
      <span className={styles.eligibilitiesBox_title}>Client Identity</span>
      <ol className={styles.eligibilitiesLabels}>

        {/* Todo: This list rendering logic will be refactored when the API is setup */}
        {eligibilityList.map(eligibilityItem => (
          <li key={eligibilityItem.label} className={styles.listContainer}>
            <span className={styles.eligibilityListItem}>
              {eligibilityItem.label}
            </span>
            <ul className={styles.eligibilitiesList}>
              {eligibilityItem.eligibilities.map(eligibility => (
                <li key={`${eligibilityItem.label}-${eligibility.name}`} className={styles.eligibilityItem}>
                  <Checkbox
                    onChange={evt => updateCheckedEligibilities(evt, eligibilityItem.label)}
                    name={eligibility.name}
                    id={`${eligibilityItem.label}-${eligibility.name}`}
                    checked={eligibility.checked}
                  />
                  <label className={styles.eligibilityLabel} htmlFor={`${eligibilityItem.label}-${eligibility.name}`}>
                    {eligibility.name}
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
