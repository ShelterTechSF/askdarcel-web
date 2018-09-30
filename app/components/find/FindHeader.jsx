import React from 'react';
import { browserHistory } from 'react-router';
import './FindHeader.scss';


class FindHeader extends React.Component {
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
    }
    return false;
  }

  render() {
    return (
      <header className="hero header-large" role="banner">
        <h1>Hello, what can we help you find?</h1>
        <h3>Search 1,138 housing and homelessness related services in San Francisco</h3>
        <form
          onSubmit={this.submitSearch}
          className="search-container form-row"
          role="search"
        >
          <input
            ref={(c) => { this.searchComponent = c; }}
            type="text"
            className="search-field"
            placeholder='try "rental assistance" or "Compass Family Shelter"'
            name="srch-term"
            id="srch-term"
          />
          <button id="largeheader_searchbutton" className="button search" type="submit">
            <span>Search</span>
          </button>
        </form>
      </header>

    );
  }
}

export default FindHeader;
