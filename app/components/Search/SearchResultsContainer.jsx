import React from 'react';
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
          <SearchTable />
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
