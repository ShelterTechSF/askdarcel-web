import React, { FormEvent, useEffect, useState } from "react";
import { useClearRefinements, useSearchBox } from "react-instantsearch";
import styles from "./SiteSearchInput.module.scss";
import { useNavigate } from "react-router-dom";

/**
 * Sitewide listing search component that controls the search query input
 *
 * The custom submit logic determines that applying a new search term will reset all refinements and
 * return a fresh set of results for the new query.
 */
export const SiteSearchInput = () => {
  const { query, refine } = useSearchBox();
  const { refine: clearRefine } = useClearRefinements();
  const [inputValue, setInputValue] = useState(query);
  const navigate = useNavigate();

  function setQuery(newQuery: string) {
    setInputValue(newQuery);
  }

  // Sets query, clears refinments, and then redirects to the search page. If the user is already on the
  // search page the last step is basically a noop.
  const submitSearch = (e: FormEvent) => {
    e.preventDefault();

    refine(inputValue);
    clearRefine();
    navigate("/search");

    return false;
  };

  // Watches changes to the query that can come from other components, like a "Clear Search" button
  useEffect(() => {
    if (!query) {
      setInputValue("");
    }
  }, [query]);

  return (
    <form onSubmit={submitSearch} className={styles.navSearch} role="search">
      <input
        onChange={(e) => setQuery(e.target.value)}
        value={inputValue}
        type="text"
        className={styles.searchField}
        placeholder="Search for a service or organization"
        name="srch-term"
        id="srch-term"
      />
      <button
        type="submit"
        aria-label="Search"
        className={`${styles.searchIcon} fa-solid fa-magnifying-glass`}
      />
    </form>
  );
};
