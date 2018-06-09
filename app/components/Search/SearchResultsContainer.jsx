import React from 'react';
import { Link } from 'react-router';
import { connectStateResults } from 'react-instantsearch/connectors';
import { Loader } from 'components/ui';
import SearchTable from './SearchTable';
import SearchMap from './SearchMap';

// Connects the Algolia searchState and searchResults to this component
// Learn more here: https://community.algolia.com/react-instantsearch/connectors/connectStateResults.html
const searchResultsContainer = connectStateResults(
  ({ searchState, searchResults, searching }) => {
    let output = null;
    if (!searchResults && searching) {
      output = <Loader />;
    } else if (searchResults && searchResults.nbHits === 0) {
      output = <div>No results have been found for {searchState.query}</div>;
    } else if (searchResults) {
      output = (
        <div className="results">
          <div>
            <SearchTable />
            <div className="add-resource">
              <h4>Can&apos;t find the organization you&apos;re looking for? </h4>
              <h3 className="entry-headline">
                <Link to="/resource/new">
                  <i className="material-icons">add_circle</i> Add an organization to our database
                </Link>
              </h3>
            </div>
          </div>
          <SearchMap hits={searchResults.hits} />
        </div>
      );
    }

    return (
      <div>
        {output}
      </div>
    );
  });

export default searchResultsContainer;
