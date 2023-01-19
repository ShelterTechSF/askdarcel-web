import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import qs from 'qs';
import ReactGA from 'react-ga';

import { Button } from 'components/ui/inline/Button/Button';
import { Section } from 'components/ucsf/Section/Section';
import { Layout } from 'components/ucsf/Layout/Layout';
import { SubcategoryRefinements } from 'components/ucsf/RefinementLists/SubcategoryRefinements';
import { EligibilityRefinements } from 'components/ucsf/RefinementLists/EligibilityRefinements';
import { eligibilityMap } from 'components/ucsf/RefinementLists/ucsfEligibilitiesMap';

import { CATEGORIES } from '../ServiceDiscoveryForm/constants';
import { useSubcategoriesForCategory } from '../../hooks/APIHooks';

import styles from './UcsfDiscoveryForm.module.scss';

interface SubcategoryRefinement {
  name: string;
  id: number;
}

interface SelectedSubcategories {
  [key: number]: boolean;
}

const seeAllPseudoId = -1;

const Page = () => {
  interface SelectedEligibilities {
    [key: string]: boolean;
  }

  const [selectedEligibilities, setSelectedEligibilities] =
    useState<SelectedEligibilities>({});
  const [selectedSubcategories, setSelectedSubcategories] =
    useState<SelectedSubcategories>({});

  interface LocationState {
    selectedResourceSlug: string;
    selectedEligibilityNames: string[];
  }

  const history = useHistory<LocationState>();
  const { state } = history.location;
  const selectedResourceSlug = state && state.selectedResourceSlug;
  const resourceEligibilityGroups = eligibilityMap[selectedResourceSlug];
  const category = CATEGORIES.find((c) => c.slug === selectedResourceSlug);

  const [currentStep, setCurrentStep] = useState(0);

  const subcategories: SubcategoryRefinement[] =
    useSubcategoriesForCategory(category?.id ?? null) || [];

  if (!category) {
    history.push('/');
    return null;
  }

  const { steps } = category;
  const stepName = steps[currentStep];

  const goToNextStep = (slug: string) => {
    // Take the user to the results page or the subsequent refinement step, depending
    // on where the user is in the pathway
    const nextStepIsResults = steps[currentStep + 1] === 'results';
    if (nextStepIsResults) {
      const flatEligibilities = resourceEligibilityGroups.flatMap(
        (group) => group.eligibilities
      );
      const selectedEligibilityNames = flatEligibilities.flatMap(
        (eligibility) => {
          if (
            selectedEligibilities[eligibility.checkedId] &&
            !eligibility.isSeeAll
          ) {
            return eligibility.name;
          }

          return [];
        }
      );

      const searchState = {
        refinementList: {
          eligibilities: selectedEligibilityNames,
          categories: subcategories.flatMap((c) => {
            const isSeeAllItem = c.id === seeAllPseudoId;
            if (!isSeeAllItem && selectedSubcategories[c.id]) {
              return c.name;
            }
            return [];
          }),
        },
      };

      const categoriesRefinements =
        searchState.refinementList.categories.join('; ') || 'NONE';
      const eligibilitiesRefinements =
        searchState.refinementList.eligibilities.join('; ') || 'NONE';
      const search = qs.stringify(searchState, { encodeValuesOnly: true });

      ReactGA.event({
        category: 'UCSF Resource Inquiry',
        action: 'Refined UCSF Resource Inquiry',
        label: `${slug} Inquiry | Category Refinements: ${categoriesRefinements} | Eligibility Refinements: ${eligibilitiesRefinements}`,
      });

      history.push(`/${slug}/results?${search}`);
      return;
    }

    setCurrentStep(currentStep + 1);
  };

  const backToResourceSelection = () => {
    if (currentStep === 0) {
      history.push('/');
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  let stepSubtitle = `Step ${currentStep + 2}: `;
  if (stepName === 'eligibilities') {
    stepSubtitle += 'Can you tell us more about your client and their needs?';
  } else {
    stepSubtitle +=
      'Can you tell us more about the services that your client is looking for?';
  }

  const nextStepName = steps[currentStep + 1];
  let nextButtonText = 'Next: ';
  if (nextStepName === 'subcategories') {
    nextButtonText += 'Service Type';
  } else if (nextStepName === 'results') {
    nextButtonText += 'Service List';
  }

  return (
    <div className={styles.discoveryFormPage}>
      <Section addClass={styles.subtitleMargin} subtitle={stepSubtitle} />
      <div className={styles.eligibilitiesContainer}>
        {stepName === 'eligibilities' ? (
          <EligibilityRefinements
            resourceEligibilityGroups={resourceEligibilityGroups}
            selectedEligibilities={selectedEligibilities}
            setSelectedEligibilities={setSelectedEligibilities}
          />
        ) : (
          <SubcategoryRefinements
            subcategories={subcategories}
            selectedSubcategories={selectedSubcategories}
            setSelectedSubcategories={setSelectedSubcategories}
          />
        )}

        <div className={styles.navigationButtons}>
          <Button onClick={backToResourceSelection}>Back</Button>
          <Button
            onClick={() => {
              goToNextStep(selectedResourceSlug);
            }}
          >
            {nextButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export const UcsfDiscoveryForm = () => (
  <Layout>
    <Page />
  </Layout>
);
