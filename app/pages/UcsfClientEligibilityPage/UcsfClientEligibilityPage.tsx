import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Checkbox } from 'components/ui/inline/Checkbox/Checkbox';
import { Button } from 'components/ui/inline/Button/Button';
import { Section } from 'components/ucsf/Section/Section';
import { Layout } from 'components/ucsf/Layout/Layout';

import {
  eligibilityMap,
  Eligibility,
  EligibilityGroup,
} from './ucsfEligibilitiesMap';
import styles from './UcsfClientEligibilityPage.module.scss';

interface SelectedEligibilities {
  [key: string]: boolean;
}

const ClientEligibilities = ({
  resourceEligibilityGroups, selectedEligibilities, setSelectedEligibilities, resourceSlug,
}: {
  resourceEligibilityGroups: EligibilityGroup[];
  selectedEligibilities: SelectedEligibilities;
  setSelectedEligibilities: (categories: SelectedEligibilities) => void;
  resourceSlug: string;
}) => {
  useEffect(() => {
    setEligibilityGroupList(resourceEligibilityGroups);
  }, [resourceSlug]);

  const [eligibilityGroupList, setEligibilityGroupList] = useState<EligibilityGroup[]>(
    resourceEligibilityGroups,
  );

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
    <div className={styles.eligibilitiesBox}>
      <div className={styles.eligibilitiesBox_title}>Client Identity</div>
      <ol className={styles.eligibilitiesLabels}>
        {eligibilityGroupList.map(eligibilityGroup => (
          <li key={eligibilityGroup.label} className={styles.listContainer}>
            <span className={styles.eligibilityGroupLabel}>
              {eligibilityGroup.label}
            </span>
            <ul className={styles.eligibilitiesList}>
              {eligibilityGroup.eligibilities.map(eligibility => (
                <li key={`${eligibilityGroup.label}-${eligibility.name}`} className={styles.eligibilityGroup}>
                  <Checkbox
                    onChange={() => handleEligibilityClick(
                      eligibility,
                      eligibilityGroup.eligibilities,
                    )}
                    name={eligibilityGroup.label}
                    id={`${eligibilityGroup.label}-${eligibility.name}`}
                    checked={selectedEligibilities[eligibility.checkedId] ?? false}
                  />
                  <label className={styles.eligibilityLabel} htmlFor={`${eligibilityGroup.label}-${eligibility.name}`}>
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

const Page = () => {
  const [selectedEligibilities, setSelectedEligibilities] = useState<SelectedEligibilities>({});

  interface LocationState {
    selectedResourceSlug: string;
    selectedEligibilityNames: string[];
  }

  const history = useHistory<LocationState>();
  const { state } = history.location;
  const selectedResourceSlug = state && state.selectedResourceSlug;
  const resourceEligibilityGroups = eligibilityMap[selectedResourceSlug];

  const goToServiceTypePage = (slug: string) => {
    const flatEligibilities = resourceEligibilityGroups.flatMap(group => (group.eligibilities));
    const selectedEligibilityNames = flatEligibilities.flatMap(eligibility => {
      if (selectedEligibilities[eligibility.checkedId] && !eligibility.isSeeAll) {
        return eligibility.name;
      }

      return [];
    });

    history.push('/service-type', { selectedResourceSlug: slug, selectedEligibilityNames });
  };

  const backToResourceSelection = () => {
    history.push('/');
  };

  if (!selectedResourceSlug) {
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
          resourceEligibilityGroups={resourceEligibilityGroups}
          selectedEligibilities={selectedEligibilities}
          setSelectedEligibilities={setSelectedEligibilities}
          resourceSlug={selectedResourceSlug}
        />
        <div className={styles.eligibilitiesBtns}>
          <Button
            onClick={backToResourceSelection}
          >
            Back
          </Button>
          <Button
            onClick={() => { goToServiceTypePage(selectedResourceSlug); }}
          >
            Next: Service Capacity
          </Button>
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
