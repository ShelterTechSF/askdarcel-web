import React from 'react';
import { Link } from 'react-router';
import { connectStateResults } from 'react-instantsearch/connectors';
import { Loader } from 'components/ui';
import Filtering from './Filtering';
import SearchTable from './SearchTable';
import SearchMap from './SearchMap';
import './SearchResultsContainer.scss';

// Connects the Algolia searchState and searchResults to this component
// Learn more here: https://community.algolia.com/react-instantsearch/connectors/connectStateResults.html
const searchResultsContainer = connectStateResults(
  ({ searchState, searchResults, searching }) => {
    let output = null;
    if (!searchResults && searching) {
      output = <Loader />;
    } else if (searchResults && searchResults.nbHits === 0) {
      output = (
        <div className="no-results">
          No results have been found for
          {' '}
          {searchState.query}
        </div>
      );
    } else if (searchResults) {
      output = (
        <div className="results">
          <div className="results-table">
            <div className="results-header">
              {searchResults.query.length > 0
                && <h1>{searchResults.query}</h1>
              }
              <Filtering />
            </div>
            <SearchTable
              hits={searchResults.hits}
              page={searchResults.page}
              hitsPerPage={searchResults.hitsPerPage}
            />
            <div className="add-resource">
              Can&apos;t find the organization you&apos;re looking for?
              <Link to="/resource/new" className="add-resource-button">
                <i className="material-icons">add_circle</i>
                {' '}
                Add an organization
              </Link>
            </div>
          </div>
          <SearchMap hits={searchResults.hits} />
        </div>
      );
    }

    return (
      <div className="results-wrapper">
        {output}
      </div>
    );
  },
);

export default searchResultsContainer;
