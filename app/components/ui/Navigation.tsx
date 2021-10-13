import React, { FormEvent, Fragment, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
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

export const Navigation = ({ showSearch, toggleHamburgerMenu }: { showSearch: boolean; toggleHamburgerMenu: () => void }) => {
  const history = useHistory();
  const { search } = useLocation();
  const [query, setQuery] = useState('');
  const [showSecondarySearch, setShowSecondarySearch] = useState(false);

  const submitSearch = (e: FormEvent) => {
    e.preventDefault();
    if (query) {
      const qp = new URLSearchParams(search);
      qp.append('query', query);
      history.push(`/search?${qp.toString()}`);
      window.location.reload();
    }
    return false;
  };

  // On the SF Families whitelabel site, we want to link to an external site
  // (the SF Families website), so it must be an external link. For other
  // sites, we want to just use an internal react-router Link to the root URL,
  // since 1) this allows us to use react-router routing and 2) this avoids
  // having staging and development environments link to the production site.
  return (
    <nav className={siteNavStyle}>
      <div className={styles.primaryRow}>
        {
          /^https?:\/\//.test(logoLinkDestination)
            ? (
              <a className={navLogoStyle} href={siteUrl}>
                <img src={logoSmall} alt={title} />
              </a>
            )
            : (
              <Link className={navLogoStyle} to="/">
                <img src={logoSmall} alt={title} />
              </Link>
            )
        }
        {showSearch
            && (
              <form
                onSubmit={submitSearch}
                className={`${styles.navSearch} search-container form-row`}
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
            )
          }
      </div>
      <div>
        {showMobileNav
          && (
            <Fragment>
              <div className={styles.mobileNavigation}>
                <button type="button" className={styles.searchButton} onClick={() => setShowSecondarySearch(!showSecondarySearch)} />
                <button type="button" className={styles.hamburgerButton} onClick={toggleHamburgerMenu} />
              </div>
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
              </ul>
            </Fragment>
          )
        }
      </div>
      <div className={`${styles.secondaryRowWrapper} ${showSecondarySearch ? '' : styles.hide}`}>
        <div className={styles.secondaryRow}>
          <form
            onSubmit={submitSearch}
            role="search"
          >
            <input
              onChange={e => setQuery(e.target.value)}
              value={query}
              className={styles.secondarySearchField}
              type="text"
              /* TODO: update placeholder text to include dynamic number of resources */
              placeholder="Search for a service or organization"
            />
          </form>
        </div>
      </div>
    </nav>
  );
};
