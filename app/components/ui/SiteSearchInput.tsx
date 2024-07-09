import React, { FormEvent } from "react";
import { useHistory } from "react-router-dom";
import cn from "classnames";
import qs from "qs";
import { useSiteSearch } from "../../hooks/SiteSearch";
import styles from "./SiteSearchInput.module.scss";

/**
 *
 * @param param0
 * @returns
 */
export const SiteSearchInput = ({
  extraClasses,
}: {
  extraClasses?: string;
}) => {
  const { query, setQuery } = useSiteSearch();
  const history = useHistory();

  const submitSearch = (e: FormEvent) => {
    e.preventDefault();
    const searchState = qs.parse(window.location.search.slice(1));

    if (query) {
      searchState.query = query;
    } else {
      delete searchState.query;
    }

    history.push(`/search?${qs.stringify(searchState)}`);
    return false;
  };

  return (
    <form
      onSubmit={submitSearch}
      className={cn([
        styles.navSearch,
        extraClasses,
        "search-container",
        "form-row",
      ])}
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
    </form>
  );
};
