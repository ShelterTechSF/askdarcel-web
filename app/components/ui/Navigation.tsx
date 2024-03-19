import React, { FormEvent, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import cn from "classnames";
import qs from "qs";
import { useAppContext, whiteLabel } from "utils";
import Translate from "./Translate";
import styles from "./Navigation.module.scss";

const {
  appImages: { logoSmall },
  logoLinkDestination,
  navLogoStyle,
  showMobileNav,
  showReportCrisis,
  siteNavStyle,
  title,
} = whiteLabel;

export const Navigation = ({
  showSearch,
  toggleHamburgerMenu,
}: {
  showSearch: boolean;
  toggleHamburgerMenu: () => void;
}) => {
  const [query, setQuery] = useState("");
  const [showSecondarySearch, setShowSecondarySearch] = useState(false);
  const searchProps = { query, setQuery };

  // On the SF Families whitelabel site, we want to link to an external site
  // (the SF Families website), so it must be an external link. For other
  // sites, we want to just use an internal react-router Link to the root URL,
  // since 1) this allows us to use react-router routing and 2) this avoids
  // having staging and development environments link to the production site.
  return (
    <nav className={siteNavStyle}>
      <div className={styles.primaryRow}>
        <div className={styles.navLeft}>
          <SiteLogo />
          {showSearch && (
            <SiteSearch extraClasses={styles.navSearchFull} {...searchProps} />
          )}
        </div>
        <SiteLinks />

        {showMobileNav && (
          <div className={styles.mobileNavigation}>
            <button
              type="button"
              aria-label="search for a service"
              className={styles.searchButton}
              onClick={() => setShowSecondarySearch(!showSecondarySearch)}
            />
            <button
              type="button"
              aria-label="navigation menu"
              className={styles.hamburgerButton}
              onClick={toggleHamburgerMenu}
            />
          </div>
        )}
      </div>

      {showSecondarySearch && (
        <div className={styles.secondaryRowWrapper}>
          <div className={styles.secondaryRow}>
            <SiteSearch
              extraClasses={styles.mobileNavigation}
              {...searchProps}
            />
          </div>
        </div>
      )}
    </nav>
  );
};

const SiteLogo = () =>
  /^https?:\/\//.test(logoLinkDestination) ? (
    <a
      className={`${navLogoStyle} ${styles.navLogo}`}
      href={logoLinkDestination}
    >
      <img src={logoSmall} alt={title} />
    </a>
  ) : (
    <Link className={`${navLogoStyle} ${styles.navLogo}`} to="/">
      <img src={logoSmall} alt={title} />
    </Link>
  );

const SiteLinks = () => {
  const context = useAppContext();
  const { authState } = context;

  return (
    <ul className={styles.navRight}>
      {/* Todo: This will eventually be replaced by a user icon with a dropdown menu of account related options.
          The designs are still forthcoming. For now, it serves as a basic log-out functionality for the purposes
          of development and testing.
      */}
      {authState && (
        <li>
          <Link to="/log-out">Log Out</Link>
        </li>
      )}
      <li>
        <Link to="/about">About</Link>
      </li>
      <li>
        <a
          href="https://help.sfserviceguide.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          FAQ
        </a>
      </li>
      <li>
        <a
          href="https://help.sfserviceguide.org/en/collections/1719243-contact-us"
          target="_blank"
          rel="noopener noreferrer"
        >
          Contact Us
        </a>
      </li>
      {showReportCrisis && (
        <li>
          <a
            type="button"
            aria-label="report street crisis"
            href="https://sf.gov/information/reporting-concerns-about-street-crises-and-conditions"
            className={styles.buttonLink}
            target="blank"
            rel="noopener noreferrer"
          >
            Report Street Crisis
          </a>
        </li>
      )}
      <Translate />
    </ul>
  );
};

const SiteSearch = ({
  query,
  setQuery,
  extraClasses,
}: {
  extraClasses?: string;
  query: string;
  setQuery: (q: string) => void;
}) => {
  const history = useHistory();
  const submitSearch = (e: FormEvent) => {
    e.preventDefault();
    if (query) {
      const searchState = qs.parse(window.location.search.slice(1));
      searchState.query = query;
      history.push(`/search?${qs.stringify(searchState)}`);
    }
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
