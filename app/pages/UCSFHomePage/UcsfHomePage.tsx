import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { icon as assetIcon } from 'assets';
import Input from 'components/ui/inline/Input';

import styles from './UcsfHomePage.module.scss';


const UcsfHomePage = () => {
  // Store resourceList on state so as to model checked resource list items.
  const [resourceList, setResourceList] = useState(resourceListArray);

  const historyHook = useHistory();

  const goToEligibilities = () => {
    const checkedResources: any = {};
    resourceList.forEach(resource => {
      checkedResources[resource.name] = resource.checked;
    });

    historyHook.push('/client-identity', checkedResources);
  };

  return (
    <div className={styles.ucsfHomePage}>
      <h2 className={styles.title}>For Clinicians</h2>
      <p className={styles.subTitle}>Lorem Ipsum Dolorum</p>
      <h2 className={styles.title}>Step 1: What kind of assistance does your client need? Select all that apply.</h2>
      <ResourceListComponent resourceList={resourceList} setResourceList={setResourceList} />
      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={goToEligibilities}>Next</button>
      </div>
    </div>
  );
};

export default UcsfHomePage;


interface resourceListItem {
  name: string,
  icon: string,
  checked: boolean,
}

const resourceListArray = [{
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

const ResourceListComponent = ({resourceList, setResourceList}: {
  resourceList: resourceListItem[];
  setResourceList: (resourcesArray: resourceListItem[]) => void;
}) => {
  return (
    <ul className={styles.resourceList}>
      {resourceList.map((resource: resourceListItem) => {
        const handleToggleItem = (evt: React.ChangeEvent<HTMLInputElement>) => {
          const newList = resourceList.map((item) => {
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
          <li key={resource.name} className={`${styles.resourceItem}
            ${resource.checked ? styles.isChecked : ''}`}>
            <label className={styles.resourceLabel} htmlFor={resource.name}>
              <Input
                onChange={handleToggleItem}
                type='checkbox'
                name={resource.name}
                id={resource.name}
                checked={resource.checked}
                addClass={styles.resourceCheckbox}
              />
              <img src={assetIcon(resource.icon)} alt={resource.name} className={styles.icon} />
              <p>{resource.name}</p>
            </label>
          </li>
        );
      })}
    </ul>
  );
};
