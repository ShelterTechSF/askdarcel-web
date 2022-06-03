import React, { FormEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import cn from 'classnames';
import qs from 'qs';
import Translate from './Translate';
import whiteLabel from '../../utils/whitelabel';
import styles from './Navigation.module.scss';

const {
  appImages: {
    logoSmall,
  },
  logoLinkDestination,
  navLogoStyle,
  showMobileNav,
  siteNavStyle,
  siteUrl,
  title,
} = whiteLabel;

export const Navigation = ({ showSearch, toggleHamburgerMenu }: {
  showSearch: boolean;
  toggleHamburgerMenu: () => void;
}) => {
  const [query, setQuery] = useState('');
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
          { showSearch && <SiteSearch extraClasses={styles.navSearchFull} {...searchProps} /> }
        </div>
        <SiteLinks />

        {showMobileNav && (
          <div className={styles.mobileNavigation}>
            <button type="button" className={styles.searchButton} onClick={() => setShowSecondarySearch(!showSecondarySearch)} />
            <button type="button" className={styles.hamburgerButton} onClick={toggleHamburgerMenu} />
          </div>
        )}
      </div>

      {showSecondarySearch && (
        <div className={styles.secondaryRowWrapper}>
          <div className={styles.secondaryRow}>
            <SiteSearch extraClasses={styles.mobileNavigation} {...searchProps} />
          </div>
        </div>
      )}
    </nav>
  );
};

const SiteLogo = () => (/^https?:\/\//.test(logoLinkDestination)
  ? (
    <a className={`${navLogoStyle} ${styles.navLogo}`} href={siteUrl}>
      <img src={logoSmall} alt={title} />
    </a>
  )
  : (
    <Link className={`${navLogoStyle} ${styles.navLogo}`} to="/">
      <img src={logoSmall} alt={title} />
    </Link>
  ));

const SiteLinks = () => (
  <ul className={styles.navRight}>
    <li>
      <Link to="/about">
        About
      </Link>
    </li>
    <li>
      <a href="https://help.sfserviceguide.org" target="_blank" rel="noopener noreferrer">
        FAQ
      </a>
    </li>
    <li>
      <a href="https://help.sfserviceguide.org/en/collections/1719243-contact-us" target="_blank" rel="noopener noreferrer">
        Contact Us
      </a>
    </li>
    <Translate />
  </ul>
);

const SiteSearch = ({ query, setQuery, extraClasses }: {
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
      className={cn([styles.navSearch, extraClasses, 'search-container', 'form-row'])}
      role="search"
    >
      <input
        onChange={e => setQuery(e.target.value)}
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
