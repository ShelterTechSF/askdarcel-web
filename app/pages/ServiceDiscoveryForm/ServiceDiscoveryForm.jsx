import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect, useHistory } from 'react-router-dom';
import qs from 'qs';

import { useEligibilitiesForCategory, useSubcategoriesForCategory } from '../../hooks/APIHooks';

import { CATEGORIES, STEPS } from './constants';
import styles from './ServiceDiscoveryForm.scss';


/** Wrapper component that handles state management, URL parsing, and external API requests. */
const ServiceDiscoveryForm = ({ match }) => {
  const { categorySlug } = match.params;
  const category = CATEGORIES.find(c => c.slug === categorySlug);
  const eligibilities = useEligibilitiesForCategory(category.id) || [];
  const subcategories = useSubcategoriesForCategory(category.id) || [];
  return (
    <InnerServiceDiscoveryForm
      categorySlug={category.slug}
      eligibilities={eligibilities}
      subcategories={subcategories}
      steps={category.steps}
    />
  );
};
ServiceDiscoveryForm.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      categorySlug: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};


/** Main component that handles form data and advancing steps. */
const InnerServiceDiscoveryForm = ({
  steps, categorySlug, eligibilities, subcategories,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedEligibilities, setSelectedEligibilities] = useState({});
  const [selectedSubcategories, setSelectedSubcategories] = useState({});

  // TODO: Should goBack go back to the previous step?
  const history = useHistory();
  const goBack = () => history.goBack();
  const goToNextStep = () => setCurrentStep(currentStep + 1);

  const handleEligibilityClick = optionId => {
    setSelectedEligibilities(
      {
        ...selectedEligibilities,
        [optionId]: !selectedEligibilities[optionId],
      },
    );
  };

  const handleSubcategoryClick = optionId => {
    setSelectedSubcategories(
      {
        ...selectedSubcategories,
        [optionId]: !selectedSubcategories[optionId],
      },
    );
  };

  const Content = () => {
    switch (steps[currentStep]) {
      case STEPS.ELIGIBILITIES:
        return (
          <FormStep
            heading="Tell us more about you"
            subheading="Select any eligibilities you identify with."
            options={eligibilities}
            selectedOptions={selectedEligibilities}
            toggleOption={handleEligibilityClick}
          />
        );
      case STEPS.SUBCATEGORIES:
        return (
          <FormStep
            heading="Tell us more about you"
            subheading="What are you currently looking for? Select all that apply."
            options={subcategories}
            selectedOptions={selectedSubcategories}
            toggleOption={handleSubcategoryClick}
          />
        );
      case STEPS.RESULTS:
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

  return (
    <Fragment>
      <Header onGoBack={goBack} />
      <Content />
      <Footer
        onGoBack={goBack}
        onNextStep={goToNextStep}
        currentStep={currentStep}
        numSteps={steps.length}
      />
    </Fragment>
  );
};


// Stateless components that only handle presentation.

const Header = ({ onGoBack }) => (
  <div className={styles.header}>
    <div className={styles.backButton} role="button" onClick={onGoBack} tabIndex="0">
      <i className="material-icons">keyboard_arrow_left</i>
      All resource guides
    </div>
  </div>
);

const Footer = ({
  onGoBack, onNextStep, currentStep, numSteps,
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
        Submit
      </button>
    </div>
  </div>
);

const ProgressBar = ({ currentNumber, totalNumber }) => (
  <div className={styles.progressBar}>
    {totalNumber > 1 && (
      <Fragment>
        <div className={styles.progressBarText}>
          {`Question ${currentNumber} / ${totalNumber}`}
        </div>
        <progress className={styles.progressBarMeter} value={currentNumber} max={totalNumber} />
      </Fragment>
    )}
  </div>
);

const FormStep = ({
  heading, subheading, options, selectedOptions, toggleOption,
}) => (
  <div className={styles.body}>
    <div className={styles.contentContainer}>
      <h1>{heading}</h1>
      <h2>{subheading}</h2>
      <ul>
        {options.map(option => (
          <li className={styles.listOption} key={option.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedOptions[option.id]}
                onChange={() => toggleOption(option.id)}
              />
              <span>{option.name}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default ServiceDiscoveryForm;
