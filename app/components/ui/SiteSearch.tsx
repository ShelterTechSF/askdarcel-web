import React, { FormEvent, useState } from "react";
import { useHistory } from "react-router-dom";
import cn from "classnames";
import qs from "qs";
import styles from "./SiteSearch.module.scss";

// TODO: Previously used as a global search in SF Service Guide. Can be repurposed for Our415 as a Top Level Category
// search per designs or similar. See:
// https://www.figma.com/proto/iDBeNK7SnZXF8wc3pbPTCY/Our415-Site?node-id=2629-11357&t=q9JDI7LISYb2Ok6T-1
export const SiteSearch = ({ extraClasses }: { extraClasses?: string }) => {
  const [query, setQuery] = useState("");
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
