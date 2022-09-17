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
  seeAllPseudoId,
} from './ucsfEligibilitiesMap';
import styles from './UcsfClientEligibilityPage.module.scss';

interface SelectedEligibilities {
  [key: string]: boolean;
}

const ClientEligibilities = ({
  resourceEligibilities, selectedEligibilities, setSelectedEligibilities, resourceSlug,
}: {
  resourceEligibilities: EligibilityGroup[];
  selectedEligibilities: SelectedEligibilities;
  setSelectedEligibilities: (categories: SelectedEligibilities) => void;
  resourceSlug: string;
}) => {
  useEffect(() => {
    setEligibilityGroupList(resourceEligibilities);
  }, [resourceSlug]);

  const [eligibilityGroupList, setEligibilityGroupList] = useState<EligibilityGroup[]>(
    resourceEligibilities,
  );

  const handleEligibilityClick = (
    eligibility: Eligibility,
    eligibilities: Eligibility[],
  ) => {
    const seeAllEligibility = eligibilities.find(e => e.id === seeAllPseudoId);
    const eligibilityCheckedId = eligibility.checkedId;
    const seeAllIsTarget = eligibility === seeAllEligibility;
    const targetValue = !selectedEligibilities[eligibilityCheckedId];
    if (seeAllIsTarget) {
      // Check or uncheck all boxes in accordance with "See all" checked value
      massToggleGroupEligibilities(eligibilities, targetValue);
    } else {
      const updatedEligibilities = {
        ...selectedEligibilities,
        [eligibilityCheckedId]: targetValue,
      };

      // If target checked value is false, uncheck "See all" box as well
      if (!targetValue) {
        // Added "!" because every Eligibility array will have a See all element
        updatedEligibilities[seeAllEligibility!.checkedId] = false;
      }

      setSelectedEligibilities(updatedEligibilities);
    }
  };

  // Toggles all eligibilities in accordance with the toggleState argument
  const massToggleGroupEligibilities = (
    eligibilities: Eligibility[],
    toggleState: boolean,
  ) => {
    const updatedEligibilities = {
      ...selectedEligibilities,
    };

    eligibilities.forEach(eligibility => {
      updatedEligibilities[eligibility.checkedId] = toggleState;
    });

    setSelectedEligibilities(updatedEligibilities);
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
                    checked={selectedEligibilities[eligibility.checkedId] || false}
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
  const [selectedEligibilities, setSelectedEligibilities] = useState<SelectedEligibilities>({});

  interface LocationState {
    selectedResourceSlug: string;
    selectedEligibilityNames: string[];
  }

  const history = useHistory<LocationState>();
  const { state } = history.location;
  const selectedResourceSlug = state && state.selectedResourceSlug;
  const resourceEligibilities = eligibilityMap[selectedResourceSlug];

  const goToServiceTypePage = (slug: string) => {
    const flattenedEligibilities = resourceEligibilities.reduce<Eligibility[]>(
      (previousValue, currentValue) => previousValue.concat(currentValue.eligibilities),
      [],
    );

    const selectedEligibilityNames = flattenedEligibilities.reduce<string[]>((
      result,
      eligibility,
    ) => {
      const isSeeAll = eligibility.id === seeAllPseudoId;
      if (selectedEligibilities[eligibility.checkedId] && !isSeeAll) {
        return [...result, eligibility.name];
      }
      return result;
    }, []);

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
          resourceEligibilities={resourceEligibilities}
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
