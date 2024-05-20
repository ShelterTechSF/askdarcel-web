import React, { useState } from "react";
import { Redirect, useHistory, useRouteMatch } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import qs from "qs";

// Todo: Once GA sunsets the UA analytics tracking come July 2023, we can remove the "react-ga"
// package and all references to it:
// https://support.google.com/analytics/answer/12938611#zippy=%2Cin-this-article
// import ReactGA from "react-ga";
import ReactGA_4 from "react-ga4";

import { whiteLabel } from "utils";
import {
  useEligibilitiesForCategory,
  useSubcategoriesForCategory,
} from "../../hooks/APIHooks";
import { CATEGORIES, Step, ServiceCategory } from "./constants";

import styles from "./ServiceDiscoveryForm.module.scss";

interface CategoryRefinement {
  name: string;
  id: number;
}

interface SelectedRefinements {
  [key: number]: boolean;
}

/** Wrapper component that handles state management, URL parsing, and external API requests. */
export const ServiceDiscoveryForm = () => {
  interface MatchParams {
    categorySlug: string;
  }

  const match = useRouteMatch();
  const { categorySlug } = match.params as MatchParams;
  const category = CATEGORIES.find((c) => c.slug === categorySlug);

  // The activeCategoryId is updated if the user proceeds to a further step that has child
  // subcategories to be displayed. When it is set, the target subcategory refinements are
  // fetched and rendered in place of the previous refinements
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(
    category?.id ?? null
  );

  // The selectedSubcategory represents the single subcategory selected by the user in
  // the RadioFormStep component
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(
    null
  );

  const eligibilities: CategoryRefinement[] =
    useEligibilitiesForCategory(activeCategoryId) || [];
  const subcategories: CategoryRefinement[] =
    useSubcategoriesForCategory(activeCategoryId) || [];

  if (!category) {
    // Category does not exist; user may have entered the category in the URL bar
    return <Redirect push to={{ pathname: "/" }} />;
  }

  return (
    <InnerServiceDiscoveryForm
      category={category}
      subcategorySubheading={category.subcategorySubheading}
      eligibilities={eligibilities}
      subcategories={subcategories}
      setActiveCategoryId={setActiveCategoryId}
      selectedSubcategory={selectedSubcategory}
      setSelectedSubcategory={setSelectedSubcategory}
    />
  );
};

/** Main component that handles form data and advancing steps. */
const InnerServiceDiscoveryForm = ({
  category,
  subcategorySubheading,
  eligibilities,
  subcategories,
  setActiveCategoryId,
  selectedSubcategory,
  setSelectedSubcategory,
}: {
  category: ServiceCategory;
  subcategorySubheading: string;
  eligibilities: CategoryRefinement[];
  subcategories: CategoryRefinement[];
  setActiveCategoryId: (id: string | null) => void;
  selectedSubcategory: number | null;
  setSelectedSubcategory: (item: number | null) => void;
}) => {
  const { name, steps, slug: categorySlug } = category;

  const [currentStep, setCurrentStep] = useState(0);
  const history = useHistory();
  const stepName = steps[currentStep];
  const disableNextBtn =
    selectedSubcategory === null &&
    ["housingStatus", "subcategoriesRadio"].includes(stepName);
  const goToNextStep = () => {
    if (stepName === "housingStatus") {
      if (!selectedSubcategory) {
        return;
      }

      if (selectedSubcategory === 1100045) {
        // User has selected first option in Long Term Housing step 1. Set category ID to Shelter
        // ID and redirect user to the Shelter resources form.
        setActiveCategoryId("1000010");
        history.replace("/shelter-resources/form");
      } else {
        const targetCategoryId = selectedSubcategory;
        // Set active category to be the subcategory that the user has selected
        setActiveCategoryId(targetCategoryId.toString());
        // Reset radio selection to prepare for next step
        setSelectedSubcategory(null);
        setCurrentStep(currentStep + 1);
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  // TODO: Should goBack go back to the previous step?
  const goBack = () => {
    history.push("/");
  };

  return (
    <>
      <Helmet>
        <title>{`Search for ${name} in San Francisco | ${whiteLabel.title}`}</title>
        <meta
          name="description"
          content={`Find ${name} in San Francisco that meet your needs`}
        />
      </Helmet>
      <Header onGoBack={goBack} />
      <Content
        steps={steps}
        currentStep={currentStep}
        eligibilities={eligibilities}
        subcategories={subcategories}
        categorySlug={categorySlug}
        subcategorySubheading={subcategorySubheading}
        setSelectedSubcategory={setSelectedSubcategory}
      />
      <Footer
        onGoBack={goBack}
        onNextStep={goToNextStep}
        currentStep={currentStep}
        numSteps={steps.length}
        disableNextBtn={disableNextBtn}
      />
    </>
  );
};

const Content = ({
  steps,
  currentStep,
  eligibilities,
  subcategories,
  categorySlug,
  subcategorySubheading,
  setSelectedSubcategory,
}: {
  steps: Step[];
  currentStep: number;
  eligibilities: CategoryRefinement[];
  subcategories: CategoryRefinement[];
  categorySlug: string;
  subcategorySubheading: string;
  setSelectedSubcategory: (targetItemId: number) => void;
}) => {
  const [selectedEligibilities, setSelectedEligibilities] =
    useState<SelectedRefinements>({});
  const [selectedSubcategories, setSelectedSubcategories] =
    useState<SelectedRefinements>({});

  const handleEligibilityClick = (targetEligibilityId: number) => {
    setSelectedEligibilities({
      ...selectedEligibilities,
      [targetEligibilityId]: !selectedEligibilities[targetEligibilityId],
    });
  };

  const handleSubcategoryClick = (targetCategoryId: number) => {
    setSelectedSubcategories({
      ...selectedSubcategories,
      [targetCategoryId]: !selectedSubcategories[targetCategoryId],
    });
  };

  const handleRadioSelect = (targetCategoryId: number) => {
    setSelectedSubcategories({ [targetCategoryId]: true });
    setSelectedSubcategory(targetCategoryId);
  };

  switch (steps[currentStep]) {
    case "housingStatus":
      return (
        <RadioFormStep
          heading="Which of the following best describes your current housing situation?"
          subheading="Select the option most relevant to you."
          handleRadioSelect={handleRadioSelect}
          refinements={subcategories}
        />
      );
    case "eligibilities":
      return (
        <FormStep
          heading="Tell us more about you"
          subheading="Select any eligibilities you identify with."
          refinements={eligibilities}
          selectedRefinements={selectedEligibilities}
          toggleRefinement={handleEligibilityClick}
        />
      );
    case "subcategories":
      return (
        <FormStep
          heading="Tell us more about you"
          subheading={subcategorySubheading}
          refinements={subcategories}
          selectedRefinements={selectedSubcategories}
          toggleRefinement={handleSubcategoryClick}
        />
      );
    case "subcategoriesRadio":
      return (
        <RadioFormStep
          heading="Tell us more about your needs"
          subheading="Select the option most relevant to you."
          handleRadioSelect={handleRadioSelect}
          refinements={subcategories}
        />
      );
    case "results":
    default: {
      const searchState = {
        refinementList: {
          eligibilities: eligibilities
            .filter((elg) => selectedEligibilities[elg.id])
            .map((el) => el.name),
          categories: subcategories
            .filter((c) => selectedSubcategories[c.id])
            .map((c) => c.name),
        },
      };

      const categoriesRefinements =
        searchState.refinementList.categories.join("; ") || "NONE";
      const eligibilitiesRefinements =
        searchState.refinementList.eligibilities.join("; ") || "NONE";
      // ReactGA.event({
      //   category: "Resource Inquiry",
      //   action: "Refined Resource Inquiry",
      //   label: `${categorySlug} Inquiry | Category Refinements: ${categoriesRefinements} | Eligibility Refinements: ${eligibilitiesRefinements}`,
      // });
      ReactGA_4.event({
        category: "Resource Inquiry",
        action: "Refined Resource Inquiry",
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

const Header = ({ onGoBack }: { onGoBack: () => void }) => (
  <div className={styles.header}>
    <div
      className={styles.backButton}
      role="button"
      onClick={onGoBack}
      tabIndex={0}
    >
      <i className="material-icons">keyboard_arrow_left</i>
      All resource guides
    </div>
  </div>
);

const Footer = ({
  onGoBack,
  onNextStep,
  currentStep,
  numSteps,
  disableNextBtn,
}: {
  onGoBack: () => void;
  onNextStep: () => void;
  currentStep: number;
  numSteps: number;
  disableNextBtn?: boolean;
}) => (
  <div className={styles.footer}>
    <div className={styles.progressBarContainer}>
      {/*
       * Add 1 to current step because it is 0-indexed.
       * Subtract 1 from numSteps because we shouldn't include the RESULT step.
       */}
      <ProgressBar currentNumber={currentStep + 1} totalNumber={numSteps - 1} />
    </div>
    <div className={styles.actionGroup}>
      <button
        type="button"
        className={`${styles.button} ${styles.actionBack}`}
        onClick={onGoBack}
      >
        Back
      </button>
      <button
        type="button"
        className={`${styles.button} ${styles.actionSubmit}`}
        onClick={onNextStep}
        disabled={disableNextBtn}
      >
        Next
      </button>
    </div>
  </div>
);

const ProgressBar = ({
  currentNumber,
  totalNumber,
}: {
  currentNumber: number;
  totalNumber: number;
}) => (
  <div className={styles.progressBar}>
    {totalNumber > 1 && (
      <>
        <div className={styles.progressBarText}>
          {`Question ${currentNumber} / ${totalNumber}`}
        </div>
        <progress
          className={styles.progressBarMeter}
          value={currentNumber}
          max={totalNumber}
        />
      </>
    )}
  </div>
);

const FormStep = ({
  heading,
  subheading,
  refinements,
  selectedRefinements,
  toggleRefinement,
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
      <ul className={styles.refinementList}>
        {refinements.map((refinement) => (
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
  heading,
  subheading,
  refinements,
  handleRadioSelect,
}: {
  heading: string;
  subheading: string;
  refinements: RadioRefinementType[];
  handleRadioSelect: (targetItemId: number) => void;
}) => (
  <div className={styles.body}>
    <div className={styles.contentContainer}>
      <h1 className={styles.contentText}>{heading}</h1>
      <h2 className={styles.contentText}>{subheading}</h2>
      <ul className={styles.refinementList}>
        {refinements.map((refinement) => (
          <li className={styles.listOption} key={refinement.id}>
            <label>
              <input
                onChange={() => handleRadioSelect(refinement.id)}
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
