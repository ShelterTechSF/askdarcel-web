import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Checkbox } from 'components/ui/inline/Checkbox';
import { Button } from 'components/ui/inline/Button';
import { Section } from 'components/ucsf/Section';
import { Layout } from 'components/ucsf/Layout';

import { serviceTypeData } from './ucsfServiceTypes';
import styles from './UcsfServiceTypePage.module.scss';

const ClientEligibilities = ({ rawServiceData, resourceSlug }: {
  rawServiceData: any;
  resourceSlug: string;
}) => {
  interface serviceTypeItem {
    checked: boolean;
    name: string;
  }

  const resourceServiceList = rawServiceData[resourceSlug];
  const [serviceTypeList, setServiceTypeList] = useState(resourceServiceList.types);

  // Todo: This setServiceType and toggleChecked logic could change pretty drastically
  // once the API returns service type data. The shape of that data is still under discussion
  // between product and dev
  const setServiceTypes = (index: number, updatedServiceType: serviceTypeItem) => {
    let updatedList;
    if (updatedServiceType.name === 'See all') {
      updatedList = serviceTypeList.map((item: serviceTypeItem) => (
        {
          ...item,
          checked: updatedServiceType.checked,
        }
      ));
      updatedList = massToggleServiceList(serviceTypeList as [], updatedServiceType.checked);
    } else {
      const seeAllServiceItem = serviceTypeList[0];
      if (!updatedServiceType.checked) {
        seeAllServiceItem.checked = false;
      }

      updatedList = [
        seeAllServiceItem,
        ...serviceTypeList.slice(1, index),
        updatedServiceType,
        ...serviceTypeList.slice(index + 1),
      ];
    }

    setServiceTypeList(updatedList);
  };

  const toggleChecked = (targetItem: serviceTypeItem) => {
    const targetToggleState = !targetItem.checked;

    return {
      ...targetItem,
      checked: targetToggleState,
    };
  };

  // Toggles all eligibilities in accordance with the toggleState argument
  const massToggleServiceList = (
    list: serviceTypeItem[],
    toggleState: boolean,
  ) => (
    list.map((item: serviceTypeItem) => ({
      ...item,
      checked: toggleState,
    }))
  );

  return (
    <div className={styles.eligibilitiesBox}>
      <div className={styles.eligibilitiesBox_title}>Service Type</div>

      <ul className={styles.eligibilitiesList}>
        {/* Todo: This list rendering logic will be refactored when the API is setup */}
        {serviceTypeList.map((item: serviceTypeItem, index: number) => (
          <li key={item.name} className={styles.eligibilityGroup}>
            <Checkbox
              onChange={() => setServiceTypes(index, toggleChecked(item))}
              name="serviceTypes"
              id={item.name}
              checked={item.checked}
            />
            <label className={styles.eligibilityLabel} htmlFor={item.name}>
              {item.name}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Page = () => {
  const history = useHistory();
  interface locationState {
    selectedResourceSlug: string;
  }

  const state = history.location.state as locationState;
  const selectedResourceSlug = state && state.selectedResourceSlug;
  const goToResourceResults = (slug: string) => {
    history.push(`/${slug}/results`);
  };

  const backToEligibilityPage = (slug: string) => {
    history.push('/client-identity', { selectedResourceSlug: slug });
  };

  if (!selectedResourceSlug) {
    // User has navigated to page directly without selecting a resource
    history.push('/');
    return null;
  }

  return (
    <div className={styles.eligibilityPage}>
      <Section
        addClass={styles.subtitleMargin}
        subtitle="Step 3: Can you tell us more about the services that your client is looking for?"
      />
      <div className={styles.eligibilitiesContainer}>
        <ClientEligibilities
          rawServiceData={serviceTypeData}
          resourceSlug={state.selectedResourceSlug}
        />
        <div className={styles.eligibilitiesBtns}>
          <Button
            text="Back"
            onClick={() => { backToEligibilityPage(selectedResourceSlug); }}
          />
          <Button
            text="Next: Service Capacity"
            onClick={() => { goToResourceResults(selectedResourceSlug); }}
            addClass={styles.goToResultsBtn}
          />
        </div>
      </div>
    </div>
  );
};

export const UcsfServiceTypePage = () => (
  <Layout>
    <Page />
  </Layout>
);

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
