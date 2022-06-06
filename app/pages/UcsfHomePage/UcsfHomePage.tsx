import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { icon as assetIcon } from 'assets';
import Input from 'components/ui/inline/Input';

import styles from './UcsfHomePage.module.scss';


interface resourceListItem {
  id: string;
  name: string;
  icon: string;
  checked: boolean;
}

// Todo: the UCSF Categories/Resources are not set up yet. For now, we're defaulting
// the below resources to Covid-* category resource IDs for development purposes only
// (using: 1000010: shelter, 1000001: food, 1000002: hygiene)
const ucsfResources = [
  {
    id: '1000010', name: 'Shelter', icon: 'bed', checked: false,
  },
  {
    id: '1000001', name: 'Substance Use', icon: 'hospital', checked: false,
  },
  {
    id: '1000002', name: 'Mental Health', icon: 'smiley-face', checked: false,
  },
];

export const UcsfHomePage = () => {
  const [resourceList, setResourceList] = useState(ucsfResources);
  const history = useHistory();

  const goToEligibilitiesStep = () => {
    const selectedResources = resourceList.filter(resource => resource.checked);
    history.push('/client-identity', { selectedResources });
  };

  return (
    <div className={styles.ucsfHomePage}>
      <h2 className={styles.title}>For Clinicians</h2>
      <p className={styles.subTitle}>Lorem Ipsum Dolorum</p>
      <h2 className={styles.title}>
        Step 1: What kind of assistance does your client need? Select all that apply.
      </h2>
      <ResourceListComponent resourceList={resourceList} setResourceList={setResourceList} />
      <div className={styles.buttonContainer}>
        <button type="button" className={styles.button} onClick={goToEligibilitiesStep}>Next</button>
      </div>
    </div>
  );
};


const ResourceListComponent = ({ resourceList, setResourceList }: {
  resourceList: resourceListItem[];
  setResourceList: (resourcesArray: resourceListItem[]) => void;
}) => {
  const updateCheckedResources = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const newList = resourceList.map(item => {
      if (item.name === evt.target.name) {
        const updatedItem = {
          ...item,
          checked: !item.checked,
        };

        return updatedItem;
      }

      return item;
    });

    setResourceList(newList);
  };

  return (
    <ul className={styles.resourceList}>
      {resourceList.map((resource: resourceListItem) => (
        <li
          key={resource.name}
          className={`${styles.resourceItem}
          ${resource.checked ? styles.isChecked : ''}`}
        >
          <label className={styles.resourceLabel} htmlFor={resource.name}>
            <Input
              onChange={updateCheckedResources}
              type="checkbox"
              name={resource.name}
              id={resource.name}
              checked={resource.checked}
              addClass={styles.resourceCheckbox}
            />
            <img src={assetIcon(resource.icon)} alt={resource.name} className={styles.icon} />
            <p>{resource.name}</p>
          </label>
        </li>
      ))}
    </ul>
  );
};
