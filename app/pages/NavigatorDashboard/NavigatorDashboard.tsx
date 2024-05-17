import React, { useEffect, useMemo, useState } from "react";
import qs from "qs";
import * as Sentry from "@sentry/browser";
import { Link, useHistory } from "react-router-dom";

import { icon } from "assets";
import { Button } from "components/ui/inline/Button/Button";
import { coreCategories } from "pages/HomePage";
import { get } from "utils/DataService";

import styles from "./NavigatorDashboard.module.scss";
import { CategoryFilters } from "./CategoryFilters/CategoryFilters";
import type { SelectedCategories } from "./CategoryFilters/CategoryFilters";
import { EligibilityFilters } from "./EligibilityFilters/EligibilityFilters";
import SearchIcon from "../../assets/img/ic-search.png";
import type { SelectOptions } from "./EligibilityFilters/EligibilityFilters";

const initialSelectedCategories: SelectedCategories = {};
coreCategories.forEach((category) => {
  initialSelectedCategories[category.algoliaCategoryName] = false;
});

// TODO: Once we have created the parent eligibilities with children in our production DB,
// this array will need to contain objects with their name and ID.
const PARENT_ELIGIBILITIES: { name: string; id: number }[] = [];

// Array containing arrays representing the selected child eligibilites of each parent eligibililty.
const initialSelectedEligibilities = PARENT_ELIGIBILITIES.map(() => []);

// TODO: Once the API is developed, replace this mock data with actual requested data from the API
const bookmarkFolders: any[] = [];
const savedSearches: any[] = [];
// const bookmarkFolders = [
//   {
//     id: 1,
//     name: "Food Kitchen List",
//     updatedAt: new Date().toISOString(),
//   },
//   {
//     id: 2,
//     name: "Dave's Service List",
//     updatedAt: "2024-05-16T19:28:48.561Z",
//   },
//   {
//     id: 3,
//     name: "24 Hour Shelters",
//     updatedAt: "2024-05-15T21:42:48.561Z",
//   },
//   {
//     id: 4,
//     name: "Job Training Resources for Veterans",
//     updatedAt: "2024-05-12T21:42:48.561Z",
//   },
// ];

// const savedSearches = [
//   {
//     id: 1,
//     description: "Food Kitchen Search",
//     url: "query=food&refinementList%5Beligibilities%5D%5B0%5D=All%20Disabilities&refinementList%5Beligibilities%5D%5B1%5D=Developmental%20Disability&refinementList%5Beligibilities%5D%5B2%5D=Physical%20Disability&refinementList%5Beligibilities%5D%5B3%5D=Learning%20Disability&refinementList%5Beligibilities%5D%5B4%5D=Intellectual%20Disability&refinementList%5Beligibilities%5D%5B5%5D=Visual%20Impairment&refinementList%5Beligibilities%5D%5B6%5D=Limited%20Mobility&refinementList%5Beligibilities%5D%5B7%5D=Deaf%20or%20Hard%20of%20Hearing&page=1&configure%5BaroundLatLng%5D=37.7758%2C%20-122.4392&configure%5BaroundRadius%5D=all&configure%5BaroundPrecision%5D=1600",
//   },
//   {
//     id: 2,
//     description: "Another Food Kitchen Search",
//     url: "query=food&refinementList%5Beligibilities%5D%5B0%5D=All%20Disabilities&refinementList%5Beligibilities%5D%5B1%5D=Developmental%20Disability&refinementList%5Beligibilities%5D%5B2%5D=Physical%20Disability&refinementList%5Beligibilities%5D%5B3%5D=Learning%20Disability&refinementList%5Beligibilities%5D%5B4%5D=Intellectual%20Disability&refinementList%5Beligibilities%5D%5B5%5D=Visual%20Impairment&refinementList%5Beligibilities%5D%5B6%5D=Limited%20Mobility&refinementList%5Beligibilities%5D%5B7%5D=Deaf%20or%20Hard%20of%20Hearing&page=1&configure%5BaroundLatLng%5D=37.7758%2C%20-122.4392&configure%5BaroundRadius%5D=all&configure%5BaroundPrecision%5D=1600",
//   },
//   {
//     id: 3,
//     description: "Search for shelters",
//     url: "query=shelters&refinementList%5Beligibilities%5D%5B0%5D=All%20Disabilities&refinementList%5Beligibilities%5D%5B1%5D=Developmental%20Disability&refinementList%5Beligibilities%5D%5B2%5D=Physical%20Disability&refinementList%5Beligibilities%5D%5B3%5D=Learning%20Disability&refinementList%5Beligibilities%5D%5B4%5D=Intellectual%20Disability&refinementList%5Beligibilities%5D%5B5%5D=Visual%20Impairment&refinementList%5Beligibilities%5D%5B6%5D=Limited%20Mobility&refinementList%5Beligibilities%5D%5B7%5D=Deaf%20or%20Hard%20of%20Hearing&page=1&configure%5BaroundLatLng%5D=37.7758%2C%20-122.4392&configure%5BaroundRadius%5D=all&configure%5BaroundPrecision%5D=1600",
//   },
//   {
//     id: 4,
//     description: "Job Resources Search",
//     url: "query=jobs&refinementList%5Beligibilities%5D%5B0%5D=All%20Disabilities&refinementList%5Beligibilities%5D%5B1%5D=Developmental%20Disability&refinementList%5Beligibilities%5D%5B2%5D=Physical%20Disability&refinementList%5Beligibilities%5D%5B3%5D=Learning%20Disability&refinementList%5Beligibilities%5D%5B4%5D=Intellectual%20Disability&refinementList%5Beligibilities%5D%5B5%5D=Visual%20Impairment&refinementList%5Beligibilities%5D%5B6%5D=Limited%20Mobility&refinementList%5Beligibilities%5D%5B7%5D=Deaf%20or%20Hard%20of%20Hearing&page=1&configure%5BaroundLatLng%5D=37.7758%2C%20-122.4392&configure%5BaroundRadius%5D=all&configure%5BaroundPrecision%5D=1600",
//   },
// ];

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
    <>
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
      <div className={styles.bookmarkAndSavedSearchContainer}>
        <h2 className={styles.bookmarksHeader}>Bookmarks and Saved Searches</h2>
        <div>
          <p className={styles.label}>Bookmarks</p>
          <ul className={styles.cardList}>
            {bookmarkFolders.map((folder) => (
              <li key={folder.id}>
                <BookmarkFolderCard folder={folder} />
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className={styles.label}>Saved Search</p>
          <ul className={styles.cardList}>
            {savedSearches.map((search) => (
              <li key={search.id}>
                <SavedSearchCard savedSearch={search} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

const SavedSearchCard = ({
  savedSearch,
}: {
  savedSearch: { id: number; description: string; url: string };
}) => {
  return (
    <Link className={styles.cardItem} to={`/search?${savedSearch.url}`}>
      <img src={SearchIcon} alt="Saved Search Icon" />
      <p>Results for &quot;{savedSearch.description}&quot;</p>
      <button type="button" className={styles.savedSearchEditButton}>
        <span className={`material-icons ${styles.savedSearchEditIcon}`}>
          minimize
        </span>
      </button>
    </Link>
  );
};

const BookmarkFolderCard = ({
  folder,
}: {
  folder: { id: number; name: string; updatedAt: string };
}) => {
  const { updatedAt } = folder;

  const dateString = useMemo(() => {
    const updatedAtDate = new Date(updatedAt);
    const now = new Date();
    const timeDifference = Math.floor((now.getTime() - updatedAtDate.getTime()) / 60000);

    if (timeDifference < 60) {
      const pluralize = timeDifference === 1 ? "" : "s";
      return `${timeDifference} min${pluralize} ago`;
    }

    if (now.toDateString() === updatedAtDate.toDateString()) {
      return "Today";
    }

    return updatedAtDate.toLocaleDateString();
  }, [updatedAt]);

  return (
    <div className={styles.cardItem}>
      <i className="material-icons">folder</i>
      <p>{folder.name}</p>
      <div className={styles.bookmarkUpdated}>
        <p>Updated</p>
        <p>{dateString}</p>
      </div>
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
