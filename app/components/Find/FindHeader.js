import React from 'react';
import { browserHistory } from 'react-router';


class FindHeader extends React.Component {
  constructor() {
    super();
    this.submitSearch = this.submitSearch.bind(this);
  }

  submitSearch(e) {
    e.preventDefault();
    if (this.searchComponent.value) {
      browserHistory.push({
        pathname: '/resources',
        query: { query: this.searchComponent.value },
      });
    }
    return false;
  }

  render() {
    return (
      <header className="hero header-large" role="banner">
        <h1>Find the resources you need</h1>
        <form
          onSubmit={this.submitSearch}
          className="search-container form-row"
          role="search"
        >
          <input
            ref={(c) => { this.searchComponent = c; }}
            type="text"
            className="search-field"
            placeholder="Search resources and providers"
            name="srch-term"
            id="srch-term"
          />
          <button id="largeheader_searchbutton" className="button search" type="submit">
            <i className="material-icons">search</i>
            <span>Search</span>
          </button>
        </form>
      </header>

    );
  }
}

export default FindHeader;
