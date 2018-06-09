import React from 'react';
import { browserHistory, Link } from 'react-router';
import { images } from 'assets';

class Navigation extends React.Component {
  constructor() {
    super();
    this.submitSearch = this.submitSearch.bind(this);
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
  render() {
    return (
      <nav className="site-nav">
        <div className="nav-left">
          <Link className="nav-logo" to={'/'}>
            <img src={images.logoSmall} alt="Ask Darcel" />
          </Link>
          <form
            onSubmit={this.submitSearch}
            className="nav-search search-container form-row"
            role="search"
          >
            <input
              ref={(c) => { this.searchComponent = c; }}
              type="text"
              className="search-field"
              placeholder="Search for a service or organization"
              name="srch-term"
              id="srch-term"
            />
          </form>
        </div>
        <ul className="nav-list disabled-feature">
          <li><a className="find">Find</a></li>
          <li><a className="saved">Saved</a></li>
          <li><a className="review">Review</a></li>
          <li><a className="goals">Goals</a></li>
          <li><a className="me">Me</a></li>
        </ul>
      </nav>
    );
  }
}

export default Navigation;
