import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { icon as assetIcon } from 'assets';
import Checkbox from 'components/ui/inline/Checkbox';
import TileButton from 'components/ui/inline/TileButton';
import Section from 'components/ucsf/Section';
import Layout from 'components/ucsf/Layout';

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

const Page = () => {
  const [resourceList, setResourceList] = useState(ucsfResources);
  const history = useHistory();

  const goToEligibilitiesStep = () => {
    const selectedResources = resourceList.filter(resource => resource.checked);
    history.push('/client-identity', { selectedResources });
  };

  return (
    <div className={styles.ucsfHomePage}>
      <Section
        title="For Clinicians"
        body="Lorem Ipsum Dolorum"
      />
      <Section
        title="Step 1: What kind of assistance does your client need? Select all that apply."
      />
      <ResourceListComponent resourceList={resourceList} setResourceList={setResourceList} />
      <div className={styles.buttonContainer}>
        <TileButton
          text="Next"
          size="medium"
          onClick={goToEligibilitiesStep}
        />
      </div>
    </div>
  );
};

const ResourceListComponent = ({ resourceList, setResourceList }: {
  resourceList: resourceListItem[];
  setResourceList: (resourcesArray: resourceListItem[]) => void;
}) => {
  const setResourceItem = (index: number, newResource: resourceListItem) => {
    const newList = [
      ...resourceList.slice(0, index),
      newResource,
      ...resourceList.slice(index + 1),
    ];

    setResourceList(newList);
  };

  const toggleChecked = (resource: resourceListItem) => ({
    ...resource,
    checked: !resource.checked,
  });

  return (
    <ul className={styles.resourceList}>
      {resourceList.map((resource: resourceListItem, i: number) => (
        <li
          key={resource.id}
          className={`${styles.resourceItem}
          ${resource.checked ? styles.isChecked : ''}`}
        >
          <label className={styles.resourceLabel} htmlFor={resource.id}>
            <Checkbox
              onChange={() => setResourceItem(i, toggleChecked(resource))}
              name={resource.name}
              id={resource.id}
              checked={resource.checked}
              addClass={styles.resourceCheckbox}
            />
            <img src={assetIcon(resource.icon)} alt={resource.name} className={styles.icon} />
            <p className={styles.resourceName}>{resource.name}</p>
          </label>
        </li>
      ))}
    </ul>
  );
};

export const UcsfHomePage = () => (
  <Layout>
    <Page />
  </Layout>
);
