import React from "react";
import { SecondaryNavigationLayout } from "components/layouts/SecondaryNavigationLayout";
import { SiteSearchInput } from "components/ui/SiteSearchInput";
import { SearchResultsPage } from "pages/SearchResultsPage/SearchResultsPage";
import styles from "./ListingsSecondaryNavigationInnerLayout.module.scss";

/**
 *
 * @param param0
 * @returns
 */
export const ListingsSecondaryNavigationInnerLayout = () => (
  <>
    <SecondaryNavigationLayout>
      <h2>Services</h2>
      {/* TODO: Show/hide button and search input on mobile */}
      <button
        type="button"
        aria-label="mobile search button"
        aria-haspopup="menu"
        onClick={() => {}}
        className={`${styles.SearchButton} fa-solid fa-magnifying-glass`}
      />
      <SiteSearchInput />
      <span>Description text explaining this section goes here.</span>
    </SecondaryNavigationLayout>
    <SearchResultsPage />
  </>
);
