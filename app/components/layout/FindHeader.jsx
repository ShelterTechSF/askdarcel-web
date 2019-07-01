import React from 'react';
import { browserHistory } from 'react-router';
import './FindHeader.scss';
import * as ax from 'axios';

class FindHeader extends React.Component {
  constructor() {
    super();
    this.submitSearch = this.submitSearch.bind(this);
    this.state = {
      resourceCount: '',
    };
  }

  componentDidMount() {
    this.getResourceCount();
  }

  getResourceCount() {
    ax.get('/api/resources/count').then(resp => {
      this.setState({ resourceCount: resp.data });
    });
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
    const { resourceCount } = this.state;
    return (
      <header className="hero header-large" role="banner">
        <div className="header-container">
          <div className="header-text">
            <p>Welcome to the SF Service Guide</p>
            <h1>
Find food, housing, health
              <br />
resources and more
              <br />
in San Francisco
            </h1>
          </div>
          <div className="location-pins">
            <span className="location-pin pin-1" />
            <span className="location-pin pin-2" />
            <span className="location-pin pin-3" />
          </div>
        </div>
        <form
          onSubmit={this.submitSearch}
          className="search-container form-row"
          role="search"
        >
          <input
            ref={c => { this.searchComponent = c; }}
            type="text"
            className="search-field"
            placeholder={`Search ${resourceCount} resources in San Francisco`}
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
