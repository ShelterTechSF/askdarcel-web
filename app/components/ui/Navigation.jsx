import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory, Link } from 'react-router';
import { images } from 'assets';
import styles from './Navigation.scss';

class Navigation extends React.Component {
  constructor() {
    super();
    this.state = {
      showSecondarySearch: false,
    };
    this.submitSearch = this.submitSearch.bind(this);
    this.toggleSecondarySearch = this.toggleSecondarySearch.bind(this);
  }
  submitSearch(e) {
    e.preventDefault();
    if (this.searchComponent.value) {
      browserHistory.push({
        pathname: '/search',
        query: { query: this.searchComponent.value },
      });
      window.location.reload();
    }
    return false;
  }

  toggleSecondarySearch() {
    this.setState(({ showSecondarySearch }) => ({ showSecondarySearch: !showSecondarySearch }));
  }

  render() {
    return (
      <nav className={styles.siteNav}>
        <div className={styles.primaryRow}>
          <div className={styles.navLeft}>
            <Link className={styles.navLogo} to={'/'}>
              <img src={images.logoSmall} alt="Ask Darcel" />
            </Link>
            {this.props.showSearch &&
              <form
                onSubmit={this.submitSearch}
                className={`${styles.navSearch} search-container form-row`}
                role="search"
              >
                <input
                  ref={(c) => { this.searchComponent = c; }}
                  type="text"
                  className={styles.searchField}
                  placeholder="Search for a service or organization"
                  name="srch-term"
                  id="srch-term"
                />
              </form>
            }
          </div>
          <div className={styles.mobileNavigation}>
            <button className={styles.searchButton} onClick={this.toggleSecondarySearch} />
            <button className={styles.hamburgerButton} onClick={this.props.toggleHamburgerMenu} />
          </div>
        </div>
        <div className={`${styles.secondaryRowWrapper} ${this.state.showSecondarySearch ? '' : styles.hide}`}>
          <div className={styles.secondaryRow}>
            <form
              onSubmit={this.submitSearch}
              role="search"
            >
              <input
                className={styles.secondarySearchField}
                ref={c => { this.searchComponent = c; }}
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
