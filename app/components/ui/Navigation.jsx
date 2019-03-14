import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory, Link } from 'react-router';
import { images } from 'assets';
import styles from './Navigation.scss';

class Navigation extends React.Component {
  constructor() {
    super();
    this.state = {
      value: '',
      showSecondarySearch: false,
    };
    this.submitSearch = this.submitSearch.bind(this);
    this.onQueryChanged = this.onQueryChanged.bind(this);
    this.toggleSecondarySearch = this.toggleSecondarySearch.bind(this);
  }

  submitSearch(e) {
    e.preventDefault();
    if (this.state.query) {
      browserHistory.push({
        pathname: '/search',
        query: { query: this.state.query },
      });
      window.location.reload();
    }
    return false;
  }

  onQueryChanged(e) {
    this.setState({ query: e.target.value });
  }

  toggleSecondarySearch() {
    this.setState(({ showSecondarySearch }) => ({ showSecondarySearch: !showSecondarySearch }));
  }

  render() {
    return (
      <nav className={styles.siteNav}>
        <div className={styles.primaryRow}>
          <div className={styles.navLeft}>
            <Link className={styles.navLogo} to="/">
              <img src={images.logoSmall} alt="Ask Darcel" />
            </Link>
            {this.props.showSearch
              && (
                <form
                  onSubmit={this.submitSearch}
                  className={`${styles.navSearch} search-container form-row`}
                  role="search"
                >
                  <input
                    onChange={this.onQueryChanged}
                    value={this.state.query}
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
          <div className={styles.mobileNavigation}>
            <button className={styles.searchButton} onClick={this.toggleSecondarySearch} />
            <button className={styles.hamburgerButton} onClick={this.props.toggleHamburgerMenu} />
          </div>
          <ul className={styles.navRight}>
            <li>
              <a href="https://www.sheltertech.org" target="_blank" rel="noopener noreferrer">
                About Us
              </a>
            </li>
            <li>
              <a href="https://www.sheltertech.org/volunteer" target="_blank" rel="noopener noreferrer">
                Volunteer
              </a>
            </li>
          </ul>
        </div>
        <div className={`${styles.secondaryRowWrapper} ${this.state.showSecondarySearch ? '' : styles.hide}`}>
          <div className={styles.secondaryRow}>
            <form
              onSubmit={this.submitSearch}
              role="search"
            >
              <input
                onChange={this.onQueryChanged}
                value={this.state.query}
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

export default Navigation;
