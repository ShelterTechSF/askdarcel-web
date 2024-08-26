import React, { FormEvent } from "react";
import { useHistory } from "react-router-dom";
import cn from "classnames";
import qs from "qs";
import { useSiteSearch } from "../../hooks/SiteSearch";
import styles from "./SiteSearchInput.module.scss";

/**
 * Sitewide listing search component
 *
 * - Updates the url querystring on every search
 * - Allows empty searches by removing `query=` query param from querystring
 */
export const SiteSearchInput = () => {
  const { query, setQuery } = useSiteSearch();
  const history = useHistory();

  // eg: `?page=1` -> `page=1`
  const removeQueryStringStart = (querystring: string) => querystring.slice(1);

  const submitSearch = (e: FormEvent) => {
    e.preventDefault();
    const queryString = removeQueryStringStart(window.location.search);
    const searchState = qs.parse(queryString);

    if (query) {
      searchState.query = query;
      searchState.page = "1";
    } else {
      delete searchState.query;
    }

    history.push(`/search?${qs.stringify(searchState)}`);
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
        value={query}
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
