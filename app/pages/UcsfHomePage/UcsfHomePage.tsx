import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { icon as assetIcon } from 'assets';
import { Radio } from 'components/ui/inline/Radio';
import { Button } from 'components/ui/inline/Button';
import { Section } from 'components/ucsf/Section';
import { Layout } from 'components/ucsf/Layout';

import styles from './UcsfHomePage.module.scss';

interface resourceListItem {
  id: string;
  name: string;
  icon: string;
  checked: boolean;
  slug: string;
}

const ResourceListComponent = ({ resourceList, setSelectedResource, setDisableNextButton }: {
  resourceList: resourceListItem[];
  setSelectedResource: any;
  setDisableNextButton: (disabled: boolean) => void;
}) => {
  /* Todo: use this code below when we allow for multiple selected resources

  const setResourceItem = (index: number, newResource: resourceListItem) => {
    const newList = [
      ...resourceList.slice(0, index),
      newResource,
      ...resourceList.slice(index + 1),
    ];

    if (newList.some(resource => resource.checked)) {
      setDisableNextButton(false);
    }

    setResourceList(newList);
  };

  const toggleChecked = (resource: resourceListItem) => {
    setDisableNextButton(!resource.checked);

    return ({
      ...resource,
      checked: !resource.checked,
    });
  };

  */

  const selectResource = (resource: resourceListItem) => {
    setDisableNextButton(false);
    setSelectedResource(resource);
  };

  return (
    <ul className={styles.resourceList}>
      {resourceList.map((resource: resourceListItem) => (
        <li
          key={resource.id}
          className={`${styles.resourceItem}
          ${resource.checked ? styles.isChecked : ''}`}
        >
          <label className={styles.resourceLabel} htmlFor={`ucsf-home-checkbox-${resource.id}`}>
            <Radio
              onChange={() => (selectResource(resource))}
              name="ucsf-resources"
              id={`ucsf-home-checkbox-${resource.id}`}
              value={resource.name}
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

const Page = () => {
  // Todo: the UCSF Categories/Resources are not set up yet. For now, we're defaulting
  // the below resources to Covid-* category resource IDs for development purposes only
  // (using: 1000010: shelter, 1000001: food, 1000002: hygiene)
  const ucsfResources = [
    {
      id: '1000010', name: 'Shelter', icon: 'bed', checked: false, slug: 'shelter-resources',
    },
    {
      id: '1000001', name: 'Substance Use', icon: 'hospital', checked: false, slug: 'substance-use-resources',
    },
    {
      id: '1000002', name: 'Mental Health', icon: 'smiley-face', checked: false, slug: 'mental-health-resources',
    },
  ];

  // todo: setResourceList will be used when we allow multiple selected resources
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [resourceList, setResourceList] = useState(ucsfResources);
  const [selectedResource, setSelectedResource] = useState<resourceListItem>();
  const [disableNextButton, setDisableNextButton] = useState(true);
  const history = useHistory();

  const goToEligibilitiesStep = () => {
    // const selectedResources = resourceList.filter(resource => resource.checked);
    if (selectedResource) {
      const selectedResourceSlug = selectedResource.slug;
      history.push('/client-identity', { selectedResourceSlug });
    }
  };

  return (
    <div className={styles.ucsfHomePage}>
      <Section
        title="For Clinicians"
        body="Lorem Ipsum Dolorum"
      />
      <Section
        addClass={styles.subtitleMargin}
        subtitle="Step 1: What kind of assistance does your client need? Select all that apply."
      />
      <ResourceListComponent
        resourceList={resourceList}
        setSelectedResource={setSelectedResource}
        setDisableNextButton={setDisableNextButton}
      />
      <div className={styles.buttonContainer}>
        <Button
          text="Next"
          onClick={goToEligibilitiesStep}
          disabled={disableNextButton}
        />
      </div>
    </div>
  );
};

export const UcsfHomePage = () => (
  <Layout>
    <Page />
  </Layout>
);
