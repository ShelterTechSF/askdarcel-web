import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { icon as assetIcon } from 'assets';
import Input from 'components/ui/inline/Input';

import styles from './Ucsf.module.scss';

interface serviceListItem {
  name: string,
  icon: string,
  checked: boolean,
}

const serviceListArray = [{
    name: 'Shelter',
    icon: 'bed',
    checked: false,
  }, {
    name: 'Substance Use',
    icon: 'hospital',
    checked: false,
  }, {
    name: 'Mental Health',
    icon: 'smiley-face',
    checked: false,
}];

const ServiceList = ({serviceList, setServiceList}: {
  serviceList: serviceListItem[];
  setServiceList: (servicesArray: serviceListItem[]) => void;
}) => {
  return (
    <ul className={styles.serviceList}>
      {serviceList.map((service: serviceListItem) => {
        const handleToggleItem = (evt: React.ChangeEvent<HTMLInputElement>) => {
          const newList = serviceList.map((item) => {
            if (item.name === evt.target.name) {
              const updatedItem = {
                ...item,
                checked: !item.checked,
              };

              return updatedItem;
            }

            return item;
          });

          setServiceList(newList);
        };

        return (
          <li key={service.name} className={`${styles.serviceItem}
            ${service.checked ? styles.isChecked : ''}`}>
            <label className={styles.itemLabel} htmlFor={service.name}>
              <Input
                onChange={handleToggleItem}
                type='checkbox'
                name={service.name}
                id={service.name}
                checked={service.checked}
              />
              <img src={assetIcon(service.icon)} alt={service.name} className={styles.icon} />
              <p>{service.name}</p>
            </label>
          </li>
        );
      })}
    </ul>
  );
};

const ClinicianStepOne = ({serviceList, setServiceList, toggleSection}: {
  serviceList: serviceListItem[];
  setServiceList: (serviceList: serviceListItem[]) => void;
  toggleSection: (targetStep: string) => void;
}) => {
  return (
    <>
      <h2 className={styles.title}>For Clinicians</h2>
      <p className={styles.subTitle}>Lorem Ipsum Dolorum</p>
      <h2 className={styles.title}>Step 1: Which resource(s) is your client looking for? Select all that apply.</h2>
      <ServiceList serviceList={serviceList} setServiceList={setServiceList} />
      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={() => toggleSection('1')}>Next</button>
      </div>
    </>
  )
};


interface eligibilityListItem {
  name: string,
  checked: boolean,
}

// todo: this will be replaced by API request
const clientEligibilitiesList = [
  {label: 'Age and Dependents', eligibilities: [{checked: false, name: 'See All'}, {checked: false, name: 'Under 18'}, {checked: false, name: 'I am a single adult and need shelter'}]},
  {label: 'Gender Identity', eligibilities: [{checked: false, name: 'See All'}, {checked: false, name: 'Woman'}, {checked: false, name: 'Man'}, {checked: false, name: 'Transgender'}]},
  {label: 'Health Related', eligibilities: [{checked: false, name: 'See All'}, {checked: false, name: 'HIV'}, {checked: false, name: 'Dual Diagnosis'}]},
];
// Object.entries(a).map(([key, value]) => {
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
    // {/* todo this will be refactored when get data back from the API */}
    <div className={styles.eligibilitiesBox} >
      <span className={styles.eligibilitiesBox_title}>Client Identity</span>
      <ol className={styles.eligibilitiesLabels}>
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

const ClinicianStepTwo = ({toggleSection}: {
  toggleSection: (targetStep: string) => void;
}) => {
  const listServices = () => {
    console.log('hi services!');
  };
  return (
    <>
      <h2 className={styles.title}>
        Step 2: Can you tell us more about your client’s eligibility for shelter resources?
      </h2>
      <div className={styles.eligibilitiesContainer}>
        <ClientEligibilities />
        <div className={styles.eligibilitiesBtns}>
          <button className={styles.button} onClick={() => toggleSection('0')}>Back</button>
          <button className={styles.buttonLarge} onClick={listServices}>Next: Service Capacity</button>
        </div>
      </div>
    </>
  )
};


export const UCSFHomePage = () => {
  // Store serviceList on state to keep track of checked resource list items.
  const [serviceList, setServiceList] = useState(serviceListArray);
  const [currentStep, setCurrentStep] = useState('1');
  const toggleSection = (targetStep: string) => {
    setCurrentStep(targetStep)
  };

  let currentSection = currentStep === '0' ? (
    <ClinicianStepOne
      serviceList={serviceList}
      setServiceList={setServiceList}
      toggleSection={toggleSection}
    />) : (
    <ClinicianStepTwo
      toggleSection={toggleSection}
    />);

  return (
    <div className={styles.ucsfHomePage}>
      {currentSection}
    </div>
  );
};