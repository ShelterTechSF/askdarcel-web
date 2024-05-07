import React, { useEffect, useState } from "react";
import qs from "qs";
import * as Sentry from "@sentry/browser";
import { useHistory } from "react-router-dom";

import { icon } from "assets";
import { Button } from "components/ui/inline/Button/Button";
import { coreCategories } from "pages/HomePage";
import { get } from "utils/DataService";

import styles from "./NavigatorDashboard.module.scss";
import { CategoryFilters } from "./CategoryFilters";
import type { SelectedCategories } from "./CategoryFilters";
import { EligibilityFilters } from "./EligibilityFilters";
import type { SelectOptions } from "./EligibilityFilters";

const initialSelectedCategories: SelectedCategories = {};
coreCategories.forEach((category) => {
  initialSelectedCategories[category.algoliaCategoryName] = false;
});

// TODO: Once we have created the parent eligibilities with children in our production DB,
// this array will need to contain objects with their name and ID.
const PARENT_ELIGIBILITIES: { name: string; id: number }[] = [];

// Array containing arrays representing the selected child eligibilites of each parent eligibililty.
const initialSelectedEligibilities = PARENT_ELIGIBILITIES.map(() => []);

const AdvancedSearch = () => {
  const [expandedOptions, setExpandedOptions] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(
    initialSelectedCategories
  );
  const [eligibilities, setEligibilities] = useState<SelectOptions[]>([]);
  const [selectedEligibilities, setSelectedEligibilities] = useState<
    SelectOptions[]
  >(initialSelectedEligibilities);
  const [searchValue, setSearchValue] = useState("");

  const history = useHistory();

  useEffect(() => {
    // This makes a request to our API for all the eligibilities belonging to parent eligibility
    // constants, which are defined above. It then maps the eligibilities to a list of select menu options.

    // The eligibilities only need to be fetched one time as they will not change.
    if (eligibilities.length) return;

    const allPromises = PARENT_ELIGIBILITIES.map((eligibility) => {
      return get(
        `/api/eligibilities/subeligibilities?id=${eligibility.id}`
      ).then((response) =>
        response.eligibilities.map(
          (childEligibility: { name: string; id: number }) => ({
            label: childEligibility.name,
            value: childEligibility.id,
          })
        )
      );
    });

    Promise.all(allPromises)
      .then((values) => {
        setEligibilities(values);
      })
      .catch((err) => {
        Sentry.captureException(err);
      });
  }, [eligibilities]);

  const submitSearch = () => {
    if (!expandedOptions && !searchValue) return;

    const searchState: { [key: string]: unknown } = {
      refinementList: {
        categories: coreCategories.flatMap((c) => {
          if (selectedCategories[c.algoliaCategoryName]) {
            return c.algoliaCategoryName;
          }
          return [];
        }),
        eligibilities: selectedEligibilities.flat().map((e) => {
          return e.label;
        }),
      },
    };

    if (searchValue) {
      searchState.query = searchValue;
    }

    const search = qs.stringify(searchState, { encodeValuesOnly: true });
    history.push(`/search?${search}`);
  };

  return (
    <div className={styles.advancedSearchContainer}>
      <h1 className={styles.header}>Hi, Navigator :)</h1>
      <p className={styles.blurb}>
        Please use the search bar to find resources for the individuals
        you&apos;re assisting. You can enter keywords such as
        &ldquo;shelter,&ldquo; &ldquo;food assistance,&ldquo; or
        &ldquo;employment support,&ldquo; to discover relevant programs and
        services.
      </p>
      <form
        className={styles.searchBoxForm}
        onSubmit={(evt) => {
          evt.preventDefault();
          submitSearch();
        }}
      >
        <div className={styles.searchInputContainer}>
          <input
            type="text"
            placeholder="Emergency Shelter"
            className={styles.searchInput}
            onChange={(evt) => setSearchValue(evt.target.value)}
          />
          <Button
            buttonType="submit"
            // Rather using the disabled attr when advanced search mode is active, we pseudo-disable
            // the button by adding styling. This is because using the disabled attr breaks using the
            // "enter" button to submit the form when focused on the search input
            addClass={`${styles.searchButton} ${
              expandedOptions ? styles.disabled : ""
            }`}
          >
            Search
          </Button>
          <button
            type="button"
            className={`${styles.searchFilterButton} ${
              expandedOptions ? styles.expandedOptions : ""
            }`}
            onClick={() => setExpandedOptions(!expandedOptions)}
          >
            <img
              src={icon(expandedOptions ? "filter-white" : "filter-gray")}
              alt="Add filters to search"
            />
          </button>
        </div>
        {expandedOptions && (
          <>
            <CategoryFilters
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
            <EligibilityFilters
              optionsGroupArray={eligibilities}
              selectedEligibilities={selectedEligibilities}
              setSelectedEligibilities={setSelectedEligibilities}
              parentEligibilities={PARENT_ELIGIBILITIES}
            />
            <div className={styles.submitButtonRow}>
              <Button buttonType="submit" addClass={styles.submitButton}>
                Submit
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export const NavigatorDashboard = () => {
  return (
    <div>
      <AdvancedSearch />
    </div>
  );
};
