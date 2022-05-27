import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import Input from 'components/ui/inline/Input';

import styles from './UcsfClientEligibilityPage.module.scss';


const UcsfClientEligibilityPage = () => {
  const historyHook = useHistory();

  // todo: Use this data to make request to API for eligibilities
  const checkedResources = historyHook.location.state;
  // if (typeof checkedResources === 'object') {
  //   for (const k in checkedResources) {
  //   }
  // }

  const goToResources = () => {
    // Todo: dynamically generate this link with query params that can be used to retrieve target
    // resource data from algolia
    historyHook.push('/food-resources/results');
  };

  const backToResourceSelection = () => {
    historyHook.push('/');
  };

  return (
    <div className={styles.ucsfHomePage}>
        <h2 className={styles.title}>
        Step 2: Can you tell us more about your client and their needs?
      </h2>
      <div className={styles.eligibilitiesContainer}>
        <ClientEligibilities />
        <div className={styles.eligibilitiesBtns}>
          <button className={styles.button} onClick={backToResourceSelection}>Back</button>
          <button className={styles.buttonLarge} onClick={goToResources}>Next: Service Capacity</button>
        </div>
      </div>
    </div>
  );
};

export default UcsfClientEligibilityPage;


// Todo: This is dummy data for development. This will be replaced by data returned by an API request
const clientEligibilitiesList = [
  {label: 'Age and Dependents', eligibilities: [{checked: false, name: 'See All'}, {checked: false, name: 'Under 18'}, {checked: false, name: 'I am a single adult and need shelter'}]},
  {label: 'Gender Identity', eligibilities: [{checked: false, name: 'See All'}, {checked: false, name: 'Woman'}, {checked: false, name: 'Man'}, {checked: false, name: 'Transgender'}]},
  {label: 'Health Related', eligibilities: [{checked: false, name: 'See All'}, {checked: false, name: 'HIV'}, {checked: false, name: 'Dual Diagnosis'}]},
];

const ClientEligibilities = () => {
  const [eligibilityList, setEligibilityList] = useState(clientEligibilitiesList);
  const handleToggleItem = (evt: React.ChangeEvent<HTMLInputElement>, label: string) => {
    const newList = eligibilityList.map((item) => {
      if (item.label === label) {
        const updatedEligibilities = item.eligibilities.map(eligibility => {
          if (eligibility.name === evt.target.name) {
            const updatedEligibility = {
              ...eligibility,
              checked: !eligibility.checked,
            };

            return updatedEligibility;
          }

          return eligibility;
        });

        item.eligibilities = updatedEligibilities;
      }

      return item;
    });

    setEligibilityList(newList);
  };

  return (
    <div className={styles.eligibilitiesBox} >
      <span className={styles.eligibilitiesBox_title}>Client Identity</span>
      <ol className={styles.eligibilitiesLabels}>

        {/* todo: this data rendering logic will be refactored when get data back from the API */}
        {eligibilityList.map((item, index) => {
            return (
              <li key={item.label} className={styles.listContainer}>
                <span>{index + 1}.  {item.label}</span>
                <ul className={styles.eligibilitiesList}>
                  {item.eligibilities.map((eligibility) => {
                    return (
                      <li key={`${item.label}-${eligibility.name}`} className={styles.eligibilityItem}>
                        <Input
                          onChange={(evt) => handleToggleItem(evt, item.label) }
                          type='checkbox'
                          name={eligibility.name}
                          id={`${item.label}-${eligibility.name}`}
                          checked={eligibility.checked}
                        />
                        <label className={styles.eligibilityLabel} htmlFor={`${item.label}-${eligibility.name}`}>
                          {eligibility.name}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </li>
            )
          })
        }
      </ol>
    </div>
  );
};