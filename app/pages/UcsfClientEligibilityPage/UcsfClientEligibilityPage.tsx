import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Checkbox } from 'components/ui/inline/Checkbox';
import { Button } from 'components/ui/inline/Button';
import { Section } from 'components/ucsf/Section';
import { Layout } from 'components/ucsf/Layout';

import { eligibilityData } from './ucsfEligibilities';
import styles from './UcsfClientEligibilityPage.module.scss';

const ClientEligibilities = ({ rawEligibilityData, resourceSlug }: {
  rawEligibilityData: any;
  resourceSlug: string;
}) => {
  interface clientEligibility {
    checked: boolean;
    name: string;
  }

  interface clientEligibilityGroup {
    label: string;
    eligibilities: clientEligibility[];
  }

  const resourceEligibilityGroup = rawEligibilityData[resourceSlug];
  const [eligibilityGroupList, setEligibilityGroupList] = useState(resourceEligibilityGroup);

  // Todo: This setEligibilityGroup and toggleChecked logic could change pretty drastically
  // once the API returns eligibility data. The shape of that data is still under discussion
  // between product and dev
  const setEligibilityGroup = (index: number, updatedEligibilityGroup: clientEligibilityGroup) => {
    const updatedList = [
      ...eligibilityGroupList.slice(0, index),
      updatedEligibilityGroup,
      ...eligibilityGroupList.slice(index + 1),
    ];

    setEligibilityGroupList(updatedList);
  };

  const toggleChecked = (eligibilityGroup: clientEligibilityGroup, eligibilityIndex: number) => {
    const targetEligibility = eligibilityGroup.eligibilities[eligibilityIndex];
    const targetToggleState = !targetEligibility.checked;
    let updatedEligibilities;

    // If a user toggles "See all", we (un)check all of the eligibilities accordingly
    if (targetEligibility.name === 'See all') {
      updatedEligibilities = massToggleGroupEligibilities(
        eligibilityGroup.eligibilities, targetToggleState,
      );
    } else {
      // If a user untoggles a specific eligiblity, this code also untoggles "See all"
      // Currently, there is no logic to toggle "See all" if a user toggles all individual
      // eligibilities given that this is somewhat of an implicit understanding; however, this
      // can be added in the future
      const seeAllEligibility = eligibilityGroup.eligibilities[0];
      if (!targetToggleState) {
        seeAllEligibility.checked = false;
      }

      const updatedEligibility = {
        ...targetEligibility,
        checked: !eligibilityGroup.eligibilities[eligibilityIndex].checked,
      };

      updatedEligibilities = [
        { ...seeAllEligibility },
        ...eligibilityGroup.eligibilities.slice(1, eligibilityIndex),
        updatedEligibility,
        ...eligibilityGroup.eligibilities.slice(eligibilityIndex + 1),
      ];
    }

    return {
      ...eligibilityGroup,
      eligibilities: updatedEligibilities,
    };
  };

  // Toggles all eligibilities in accordance with the toggleState argument
  const massToggleGroupEligibilities = (
    eligibilities: clientEligibility[],
    toggleState: boolean,
  ) => (
    eligibilities.map((eligibility: clientEligibility) => ({
      ...eligibility,
      checked: toggleState,
    }))
  );

  return (
    <div className={styles.eligibilitiesBox}>
      <div className={styles.eligibilitiesBox_title}>Client Identity</div>
      <ol className={styles.eligibilitiesLabels}>

        {/* Todo: This list rendering logic will be refactored when the API is setup */}
        {eligibilityGroupList.map((eligibilityGroup: clientEligibilityGroup, index: number) => (
          <li key={eligibilityGroup.label} className={styles.listContainer}>
            <span className={styles.eligibilityGroupLabel}>
              {eligibilityGroup.label}
            </span>
            <ul className={styles.eligibilitiesList}>
              {eligibilityGroup.eligibilities.map((eligibility, i) => (
                <li key={`${eligibilityGroup.label}-${eligibility.name}`} className={styles.eligibilityGroup}>
                  <Checkbox
                    onChange={() => setEligibilityGroup(index, toggleChecked(eligibilityGroup, i))}
                    name={eligibilityGroup.label}
                    id={`${eligibilityGroup.label}-${eligibility.name}`}
                    checked={eligibility.checked}
                  />
                  <label className={styles.eligibilityLabel} htmlFor={`${eligibilityGroup.label}-${eligibility.name}`}>
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

const Page = () => {
  const history = useHistory();
  interface locationState {
    selectedResourceSlug: string;
  }

  const state = history.location.state as locationState;
  const selectedResourceSlug = state && state.selectedResourceSlug;
  const goToServiceTypePage = (slug: string) => {
    history.push('/service-type', { selectedResourceSlug: slug });
  };

  const backToResourceSelection = () => {
    history.push('/');
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
        subtitle="Step 2: Can you tell us more about your client and their needs?"
      />
      <div className={styles.eligibilitiesContainer}>
        <ClientEligibilities
          rawEligibilityData={eligibilityData}
          resourceSlug={state.selectedResourceSlug}
        />
        <div className={styles.eligibilitiesBtns}>
          <Button
            text="Back"
            onClick={backToResourceSelection}
          />
          <Button
            text="Next: Service Capacity"
            onClick={() => { goToServiceTypePage(selectedResourceSlug); }}
            addClass={styles.goToResultsBtn}
          />
        </div>
      </div>
    </div>
  );
};

export const UcsfClientEligibilityPage = () => (
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
