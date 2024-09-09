import React, { FormEvent, useState } from "react";
import cn from "classnames";
import { useSearchBox } from "react-instantsearch";
import styles from "./SiteSearchInput.module.scss";

/**
 * Sitewide listing search component
 *
 * - Updates the url querystring on every search
 */
export const SiteSearchInput = () => {
  const { query, refine } = useSearchBox();
  const [inputValue, setInputValue] = useState(query);

  function setQuery(newQuery: string) {
    setInputValue(newQuery);
  }

  const submitSearch = (e: FormEvent) => {
    e.preventDefault();

    refine(inputValue);

    return false;
  };

  return (
    <form
      onSubmit={submitSearch}
      className={cn([styles.navSearch, "search-container", "form-row"])}
      role="search"
    >
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
