import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import qs from 'qs';
import { images } from 'assets';
import styles from './Navigation.module.scss';
import { whiteLabel } from '../../../utils/whitelabel';

class Navigation extends React.Component {
  constructor() {
    super();
    this.state = {
      showSecondarySearch: false,
    };
    this.submitSearch = this.submitSearch.bind(this);
    this.onQueryChanged = this.onQueryChanged.bind(this);
    this.toggleSecondarySearch = this.toggleSecondarySearch.bind(this);
  }

  onQueryChanged(e) {
    this.setState({ query: e.target.value });
  }

  submitSearch(e) {
    e.preventDefault();
    const { history } = this.props;
    const { query } = this.state;
    if (query) {
      const queryString = qs.stringify({ query });
      history.push(`/search?${queryString}`);
      window.location.reload();
    }
    return false;
  }

  toggleSecondarySearch() {
    this.setState(({ showSecondarySearch }) => ({ showSecondarySearch: !showSecondarySearch }));
  }

  render() {
    const { showSearch, toggleHamburgerMenu } = this.props;
    const { showSecondarySearch, query } = this.state;

    // On the SF Families whitelabel site, we want to link to an external site
    // (the SF Families website), so it must be an external link. For other
    // sites, we want to just use an internal react-router Link to the root URL,
    // since 1) this allows us to use react-router routing and 2) this avoids
    // having staging and development environments link to the production site.
    let logoLink;
    if (whiteLabel.isSFFamiliesSite) {
      logoLink = (
        <a className={styles.navLogoSFFamilies} href={whiteLabel.siteUrl}>
          <img src={images.logoSmall} alt={whiteLabel.title} />
        </a>
      );
    } else {
      logoLink = (
        <Link className={styles.navLogo} to="/">
          <img src={images.logoSmall} alt={whiteLabel.title} />
        </Link>
      );
    }

    return (
      <nav className={isSFFamiliesSite() ? styles.siteNavSFFamilies : styles.siteNav}>
        <div className={styles.primaryRow}>
          <div className={styles.navLeft}>
            {logoLink}
            {showSearch
              && (
                <form
                  onSubmit={this.submitSearch}
                  className={`${styles.navSearch} search-container form-row`}
                  role="search"
                >
                  <input
                    onChange={this.onQueryChanged}
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
          {!isSFFamiliesSite()
            && (
              <Fragment>
                <div className={styles.mobileNavigation}>
                  <button type="button" className={styles.searchButton} onClick={this.toggleSecondarySearch} />
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
              onSubmit={this.submitSearch}
              role="search"
            >
              <input
                onChange={this.onQueryChanged}
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
  }
}

Navigation.propTypes = {
  showSearch: PropTypes.bool.isRequired,
  toggleHamburgerMenu: PropTypes.func.isRequired,
};

export default withRouter(Navigation);
