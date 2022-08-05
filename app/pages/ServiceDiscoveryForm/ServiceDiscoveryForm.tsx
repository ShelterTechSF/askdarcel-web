import React, { useState } from 'react';
import { Redirect, useHistory, useRouteMatch } from 'react-router-dom';
import qs from 'qs';
import ReactGA from 'react-ga';

import { useEligibilitiesForCategory, useSubcategoriesForCategory } from '../../hooks/APIHooks';
import {
  CATEGORIES,
  Step,
  CustomStepMethods,
  CustomRefinements,
} from './constants';

import styles from './ServiceDiscoveryForm.module.scss';

interface CategoryRefinement {
  name: string;
  id: number;
}

interface SelectedRefinements {
  [key: number]: boolean;
}

/** Wrapper component that handles state management, URL parsing, and external API requests. */
export const ServiceDiscoveryForm = () => {
  const match = useRouteMatch();
  interface MatchParams {
    categorySlug: string;
  }

  const { categorySlug } = match.params as MatchParams;
  const category = CATEGORIES.find(c => c.slug === categorySlug);
  if (!category) {
    // Category does not exist; user may have entered the category in the URL bar
    // or there is an error in our code
    return <Redirect push to={{ pathname: '/' }} />;
  }

  const eligibilities: CategoryRefinement[] = useEligibilitiesForCategory(category.id) || [];
  const subcategories: CategoryRefinement[] = useSubcategoriesForCategory(category.id) || [];

  return (
    <InnerServiceDiscoveryForm
      categorySlug={category.slug}
      eligibilities={eligibilities}
      subcategories={subcategories}
      steps={category.steps}
      subcategorySubheading={category.subcategorySubheading}
      customRefinements={category.customRefinements}
      customNextMethods={category.customStepMethods}
    />
  );
};

/** Main component that handles form data and advancing steps. */
const InnerServiceDiscoveryForm = ({
  steps, eligibilities, subcategories, categorySlug, subcategorySubheading,
  customRefinements, customNextMethods,
}: {
  steps: Step[];
  eligibilities: CategoryRefinement[];
  subcategories: CategoryRefinement[];
  categorySlug: string;
  subcategorySubheading: string;
  customRefinements?: CustomRefinements;
  customNextMethods?: CustomStepMethods;
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRadioItem, setSelectedRadioItem] = useState(-1);
  const history = useHistory();
  const goBack = () => {
    if (currentStep > 0) {
      // Move user back to first step if they are on step 1 or above;
      // Sending a user back one step may not make sense considering that
      // some of the step pathways may not be strictly sequential
      setCurrentStep(0);
    } else {
      history.goBack();
    }
  };

  let goToNextStep;
  const stepName = steps[currentStep];
  if (customNextMethods?.[stepName]) {
    goToNextStep = () => {
      const nextMethod = customNextMethods[stepName];
      nextMethod(
        selectedRadioItem,
        history,
        setCurrentStep,
      );
    };
  } else if (steps[currentStep] === 'longTermHousingOptions') {
    // User is ready for results; skip the subcategories step and go to the results step
    goToNextStep = () => setCurrentStep(steps.length - 1);
  } else {
    goToNextStep = () => setCurrentStep(currentStep + 1);
  }

  return (
    <>
      <Header onGoBack={goBack} />
      <Content
        steps={steps}
        currentStep={currentStep}
        eligibilities={eligibilities}
        subcategories={subcategories}
        categorySlug={categorySlug}
        subcategorySubheading={subcategorySubheading}
        setSelectedRadioItem={setSelectedRadioItem}
        customRefinements={customRefinements}
      />
      <Footer
        onGoBack={goBack}
        onNextStep={goToNextStep}
        currentStep={currentStep}
        numSteps={steps.length}
      />
    </>
  );
};

const Content = ({
  steps, currentStep, eligibilities, subcategories, customRefinements, categorySlug,
  subcategorySubheading, setSelectedRadioItem,
}: {
  steps: Step[];
  currentStep: number;
  eligibilities: CategoryRefinement[];
  subcategories: CategoryRefinement[];
  categorySlug: string;
  subcategorySubheading: string;
  setSelectedRadioItem: (targetItemId: number) => void;
  customRefinements?: CustomRefinements;
}) => {
  const [selectedEligibilities, setSelectedEligibilities] = useState<SelectedRefinements>({});
  const [selectedSubcategories, setSelectedSubcategories] = useState<SelectedRefinements>({});

  const handleEligibilityClick = (targetEligibilityId: number) => {
    setSelectedEligibilities(
      {
        ...selectedEligibilities,
        [targetEligibilityId]: !selectedEligibilities[targetEligibilityId],
      },
    );
  };

  const handleSubcategoryClick = (targetCategoryId: number) => {
    setSelectedSubcategories(
      {
        ...selectedSubcategories,
        [targetCategoryId]: !selectedSubcategories[targetCategoryId],
      },
    );
  };

  switch (steps[currentStep]) {
    case 'housingStatus':
      return (
        <RadioFormStep
          heading="Which of the following best describes your current housing situation?"
          subheading="Select the option most relevant to you."
          setSelectedRadioItem={setSelectedRadioItem}
          refinements={customRefinements?.housingStatus || []}
        />
      );
    case 'longTermHousingOptions':
      return (
        <RadioFormStep
          heading="Tell us more about your needs."
          subheading="Select the option most relevant to you."
          setSelectedRadioItem={setSelectedRadioItem}
          refinements={customRefinements?.longTermHousingOptions || []}
        />
      );
    case 'eligibilities':
      return (
        <FormStep
          heading="Tell us more about you"
          subheading="Select any eligibilities you identify with."
          refinements={eligibilities}
          selectedRefinements={selectedEligibilities}
          toggleRefinement={handleEligibilityClick}
        />
      );
    case 'subcategories':
      return (
        <FormStep
          heading="Tell us more about you"
          subheading={subcategorySubheading}
          refinements={subcategories}
          selectedRefinements={selectedSubcategories}
          toggleRefinement={handleSubcategoryClick}
        />
      );
    case 'results':
    default:
    {
      const searchState = {
        refinementList: {
          eligibilities: eligibilities
            .filter(elg => selectedEligibilities[elg.id])
            .map(el => el.name),
          categories: subcategories
            .filter(c => selectedSubcategories[c.id])
            .map(c => c.name),
        },
      };

      const categoriesRefinements = searchState.refinementList.categories.join('; ') || 'NONE';
      const eligibilitiesRefinements = searchState.refinementList.eligibilities.join('; ') || 'NONE';
      ReactGA.event({
        category: 'Resource Inquiry',
        action: 'Refined Resource Inquiry',
        label: `${categorySlug} Inquiry | Category Refinements: ${categoriesRefinements} | Eligibility Refinements: ${eligibilitiesRefinements}`,
      });

      const search = qs.stringify(searchState, { encodeValuesOnly: true });
      return (
        <Redirect
          push
          to={{
            pathname: `/${categorySlug}/results`,
            search: `?${search}`,
          }}
        />
      );
    }
  }
};

// Stateless components that only handle presentation.

const Header = ({ onGoBack }: {
  onGoBack: () => void;
}) => (
  <div className={styles.header}>
    <div className={styles.backButton} role="button" onClick={onGoBack} tabIndex={0}>
      <i className="material-icons">keyboard_arrow_left</i>
      All resource guides
    </div>
  </div>
);

const Footer = ({
  onGoBack, onNextStep, currentStep, numSteps,
}: {
  onGoBack: () => void;
  onNextStep: () => void;
  currentStep: number;
  numSteps: number;
}) => (
  <div className={styles.footer}>
    <div className={styles.progressBarContainer}>
      {
        /*
         * Add 1 to current step because it is 0-indexed.
         * Subtract 1 from numSteps because we shouldn't include the RESULT step.
         */
      }
      <ProgressBar currentNumber={currentStep + 1} totalNumber={numSteps - 1} />
    </div>
    <div className={styles.actionGroup}>
      <button type="button" className={`${styles.button} ${styles.actionBack}`} onClick={onGoBack}>
        Back
      </button>
      <button type="button" className={`${styles.button} ${styles.actionSubmit}`} onClick={onNextStep}>
        Next
      </button>
    </div>
  </div>
);

const ProgressBar = ({ currentNumber, totalNumber }: {
  currentNumber: number;
  totalNumber: number;
}) => (
  <div className={styles.progressBar}>
    {totalNumber > 1 && (
      <>
        <div className={styles.progressBarText}>
          {`Question ${currentNumber} / ${totalNumber}`}
        </div>
        <progress className={styles.progressBarMeter} value={currentNumber} max={totalNumber} />
      </>
    )}
  </div>
);

const FormStep = ({
  heading, subheading, refinements, selectedRefinements, toggleRefinement,
}: {
  heading: string;
  subheading: string;
  refinements: CategoryRefinement[];
  selectedRefinements: SelectedRefinements;
  toggleRefinement: (targetId: number) => void;
}) => (
  <div className={styles.body}>
    <div className={styles.contentContainer}>
      <h1 className={styles.contentText}>{heading}</h1>
      <h2 className={styles.contentText}>{subheading}</h2>
      <ul>
        {refinements.map(refinement => (
          <li className={styles.listOption} key={refinement.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedRefinements[refinement.id] || false}
                onChange={() => toggleRefinement(refinement.id)}
              />
              <span>{refinement.name}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

interface RadioRefinementType {
  name: string;
  id: number;
}

const RadioFormStep = ({
  heading, subheading, setSelectedRadioItem, refinements,
}: {
  heading: string;
  subheading: string;
  setSelectedRadioItem: (targetItemId: number) => void;
  refinements: RadioRefinementType[];
}) => (
  <div className={styles.body}>
    <div className={styles.contentContainer}>
      <h1 className={styles.contentText}>{heading}</h1>
      <h2 className={styles.contentText}>{subheading}</h2>
      <ul>
        {refinements.map(refinement => (
          <li className={styles.listOption} key={refinement.id}>
            <label>
              <input
                onChange={() => (setSelectedRadioItem(refinement.id))}
                name="refinement"
                type="radio"
                value={refinement.id}
              />
              <span>{refinement.name}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
