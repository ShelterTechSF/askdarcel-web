import React, { useEffect, useMemo, useRef, useState } from "react";
import qs from "qs";
import * as Sentry from "@sentry/browser";
import { Link, useHistory } from "react-router-dom";

import { icon } from "assets";
import { Button } from "components/ui/inline/Button/Button";
import { Modal } from "components/ui/Modal/Modal";
import { coreCategories } from "pages/HomePage";
import { get } from "utils/DataService";
import { useAppContext } from "utils/useAppContext";

import { Folder, getFoldersForUser } from "models/Bookmark";
import { getCurrentUser } from "models/User";
import { SavedSearch, getSavedSearchesForUser } from "models/SavedSearch";
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
        `/api/v2/eligibilities/subeligibilities?id=${eligibility.id}`
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
        // If PARENT_ELIGIBILITIES hasn't been filled out, then allPromises will
        // be empty. If this is the case, then calling setEligibilities with an
        // empty array will cause this component to rerender infinitely, since
        // the exit condition only checks for non-empty eligibilites.
        if (values.length !== 0) setEligibilities(values);
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

const BookmarksAndSavedSearches = () => {
  const { setBookmarksMenuOpen, authState } = useAppContext();
  const [bookmarkFolders, setBookmarkFolders] = useState<Folder[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);

  useEffect(() => {
    if (!authState) return;
    const authToken = authState.accessTokenObject.token;
    getCurrentUser(authToken).then((user) => {
      const folderPromise = getFoldersForUser(user.id, authToken).then((resp) =>
        setBookmarkFolders(resp.folders)
      );
      const savedSearchPromise = getSavedSearchesForUser(
        user.id,
        authToken
      ).then((resp) => setSavedSearches(resp.saved_searches));
      return Promise.all([folderPromise, savedSearchPromise]);
    });
  }, [authState]);

  const handleRename = (id: number, newName: string) => {
    setSavedSearches((prev) =>
      prev.map((s) => (s.id === id ? { ...s, name: newName } : s))
    );
  };

  return (
    <div className={styles.bookmarkAndSavedSearchContainer}>
      <h2 className={styles.bookmarksHeader}>Bookmarks and Saved Searches</h2>
      <div>
        <p className={styles.label}>Bookmarks</p>
        <ul className={styles.cardList}>
          {bookmarkFolders.map((folder) => (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <li key={folder.id} onClick={() => setBookmarksMenuOpen(true)}>
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
              <SavedSearchCard savedSearch={search} onRename={handleRename} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const SearchParamTags = ({
  categories,
  eligibilities,
}: {
  categories: string[];
  eligibilities: string[];
}) => {
  const tags = [...(categories ?? []), ...(eligibilities ?? [])];
  if (tags.length === 0) return null;
  return (
    <div className={styles.savedSearchTags}>
      {tags.map((tag) => (
        <span key={tag} className={styles.savedSearchTag}>
          {tag}
        </span>
      ))}
    </div>
  );
};

const RenameSearchModal = ({
  savedSearch,
  isOpen,
  onClose,
  onSave,
}: {
  savedSearch: SavedSearch;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newName: string) => void;
}) => {
  const [labelValue, setLabelValue] = useState(savedSearch.name);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset input and move focus into the modal when it opens
  useEffect(() => {
    if (isOpen) {
      setLabelValue(savedSearch.name);
      inputRef.current?.focus();
    }
  }, [isOpen, savedSearch.name]);

  const MAX_LENGTH = 60;
  const trimmed = labelValue.trim();
  const isEmpty = trimmed.length === 0;
  const tooLong = trimmed.length > MAX_LENGTH;
  const isDisabled = isEmpty || tooLong;

  const handleSave = () => {
    if (isDisabled) return;
    // TODO: replace with real API call once backend is ready
    // patchSavedSearch(savedSearch.id, { name: trimmed }, authToken)
    onSave(trimmed);
    onClose();
  };

  const handleClearLabel = () => {
    // TODO: replace with real API call once backend is ready
    // patchSavedSearch(savedSearch.id, { name: savedSearch.search.query }, authToken)
    onSave(savedSearch.search.query);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} closeModal={onClose}>
      <div className={styles.renameModal}>
        <h2 className={styles.renameModalHeading}>Rename saved search</h2>
        <p className={styles.renameModalSubtext}>
          Give this search a label that makes sense to you. The original search
          query will not change.
        </p>

        <label className={styles.renameModalLabel} htmlFor="search-label-input">
          Label
        </label>
        <input
          id="search-label-input"
          ref={inputRef}
          className={styles.renameModalInput}
          type="text"
          value={labelValue}
          maxLength={MAX_LENGTH + 1}
          onChange={(e) => setLabelValue(e.target.value)}
        />
        <div className={styles.renameModalMeta}>
          {tooLong && (
            <span className={styles.renameModalError}>
              Label must be {MAX_LENGTH} characters or fewer.
            </span>
          )}
          {isEmpty && (
            <span className={styles.renameModalError}>
              A label is required.
            </span>
          )}
          <span className={styles.renameModalCounter}>
            {trimmed.length} / {MAX_LENGTH}
          </span>
        </div>

        <p className={styles.renameModalLabel}>This search includes</p>
        <div className={styles.renameModalSearchSummary}>
          {savedSearch.search.query && (
            <div className={styles.renameModalSummaryRow}>
              <span className={styles.renameModalSummaryRowLabel}>Query</span>
              <span>{savedSearch.search.query}</span>
            </div>
          )}
          {savedSearch.search.categories?.length > 0 && (
            <div className={styles.renameModalSummaryRow}>
              <span className={styles.renameModalSummaryRowLabel}>
                Categories
              </span>
              <div className={styles.savedSearchTags}>
                {savedSearch.search.categories.map((c) => (
                  <span key={c} className={styles.savedSearchTag}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
          {savedSearch.search.eligibilities?.length > 0 && (
            <div className={styles.renameModalSummaryRow}>
              <span className={styles.renameModalSummaryRowLabel}>
                Eligibilities
              </span>
              <div className={styles.savedSearchTags}>
                {savedSearch.search.eligibilities.map((e) => (
                  <span key={e} className={styles.savedSearchTag}>
                    {e}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {savedSearch.name !== savedSearch.search.query && (
          <button
            type="button"
            className={styles.renameModalClearLink}
            onClick={handleClearLabel}
          >
            Clear custom label and use original query
          </button>
        )}

        <div className={styles.renameModalActions}>
          <button
            type="button"
            className={styles.renameModalCancelButton}
            onClick={onClose}
          >
            Cancel
          </button>
          <Button
            buttonType="button"
            addClass={styles.renameModalSaveButton}
            onClick={handleSave}
          >
            Save label
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const SavedSearchCard = ({
  savedSearch,
  onRename,
}: {
  savedSearch: SavedSearch;
  onRename: (id: number, newName: string) => void;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close context menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return () => {};
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  let aroundLatLng = null;
  if (savedSearch.search.lat !== null && savedSearch.search.lng !== null) {
    aroundLatLng = `${savedSearch.search.lat}, ${savedSearch.search.lng}`;
  }

  const searchState = {
    refinementList: {
      eligibilities: savedSearch.search.eligibilities,
      categories: savedSearch.search.categories,
    },
    configure: { aroundLatLng },
    query: savedSearch.search.query,
  };
  const params = qs.stringify(searchState);

  const isRenamed = savedSearch.name !== savedSearch.search.query;

  return (
    <>
      <div className={styles.cardItem}>
        <Link className={styles.savedSearchLink} to={`/search?${params}`}>
          <img src={SearchIcon} alt="Saved Search Icon" />
          <div className={styles.savedSearchText}>
            {isRenamed ? (
              <>
                <p className={styles.savedSearchAlias}>{savedSearch.name}</p>
                <p className={styles.savedSearchQuery}>
                  Search: {savedSearch.search.query}
                </p>
              </>
            ) : (
              <p>Results for &quot;{savedSearch.name}&quot;</p>
            )}
            <SearchParamTags
              categories={savedSearch.search.categories}
              eligibilities={savedSearch.search.eligibilities}
            />
          </div>
        </Link>
        <div className={styles.savedSearchMenuWrapper} ref={menuRef}>
          <button
            type="button"
            className={styles.savedSearchMenuButton}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label={`More actions for ${savedSearch.name}`}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="material-symbols-outlined">more_horiz</span>
          </button>
          {menuOpen && (
            <div className={styles.savedSearchMenu} role="menu">
              <button
                role="menuitem"
                type="button"
                className={styles.savedSearchMenuItem}
                onClick={() => {
                  setMenuOpen(false);
                  setModalOpen(true);
                }}
              >
                Rename
              </button>
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <RenameSearchModal
          savedSearch={savedSearch}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={(newName) => onRename(savedSearch.id, newName)}
        />
      )}
    </>
  );
};

const BookmarkFolderCard = ({
  folder,
}: {
  // TODO: The API doesn't currently return the updatedAt timestamp, so we mark
  // this as optional
  folder: { id: number; name: string; updatedAt?: string };
}) => {
  const { updatedAt } = folder;

  const dateString = useMemo(() => {
    if (updatedAt === undefined) return null;
    const updatedAtDate = new Date(updatedAt);
    const now = new Date();
    const timeDifference = Math.floor(
      (now.getTime() - updatedAtDate.getTime()) / 60000
    );

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
    <div className={styles.bookmarkFolderCard}>
      <i className="material-symbols-outlined">folder</i>
      <p>{folder.name}</p>
      <div className={styles.bookmarkUpdated}>
        {dateString ? (
          <>
            <p>Updated</p>
            <p>{dateString}</p>
          </>
        ) : null}
      </div>
    </div>
  );
};

export const NavigatorDashboard = () => {
  return (
    <div>
      <AdvancedSearch />
      <BookmarksAndSavedSearches />
    </div>
  );
};
