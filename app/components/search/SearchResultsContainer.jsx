import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connectStateResults } from 'react-instantsearch/connectors';
import { Loader } from 'components/ui';
import Filtering from './Filtering';
import SearchTable from './SearchTable';
import SearchMap from './SearchMap';
import './SearchResultsContainer.scss';
import { parseAlgoliaSchedule } from '../../utils/transformSchedule';


/**
 * Transform Algolia search hits such that each hit has a recurringSchedule that
 * uses the time helper classes.
 */
const transformHits = hits => hits.map(hit => {
  const inheritedSchedule = (
    hit.schedule && hit.schedule.length ? hit.schedule : hit.resource_schedule
  );
  const recurringSchedule = (
    inheritedSchedule && inheritedSchedule.length
      ? parseAlgoliaSchedule(inheritedSchedule)
      : null
  );
  return { ...hit, recurringSchedule };
});

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return { width, height };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}

const SearchResultsContainer = ({ searchState, searchResults, searching }) => {
  const [getMapButton, setMapButton] = useState(false);
  const { width } = useWindowDimensions();
  const isMobile = (width <= 767);
  let output = null;
  if (!searchResults && searching) {
    output = <Loader />;
  } else if (searchResults && searchResults.nbHits === 0) {
    output = (
      <div className="no-results">
        <p className="no-results-text">
          No results have been found for
          {' '}
          {searchState.query}
        </p>
      </div>
    );
  } else if (searchResults) {
    const hits = transformHits(searchResults.hits);
    output = (
      <div className="results">
        <div className="results-table">
          <div className="results-header">
            {searchResults.query.length > 0
                && <h1>{searchResults.query}</h1>
            }
            <Filtering
              setMapButton={setMapButton}
              getMapButton={getMapButton}
              isMobile={isMobile}
            />
          </div>
          { (getMapButton && isMobile) ? (
            <SearchMap
              hits={hits}
              page={searchResults.page}
              hitsPerPage={searchResults.hitsPerPage}
              isMobile
            />
          ) : (
            <SearchTable
              hits={hits}
              page={searchResults.page}
              hitsPerPage={searchResults.hitsPerPage}
            />
          )
          }
          <div className="add-resource">
            Can&apos;t find the organization you&apos;re looking for?
            <Link to="/organizations/new" className="add-resource-button">
              <i className="material-icons">add_circle</i>
              {' '}
              Add an organization
            </Link>
          </div>
        </div>
        <SearchMap
          hits={hits}
          page={searchResults.page}
          hitsPerPage={searchResults.hitsPerPage}
          isMobile={false}
        />
      </div>
    );
  }

  return (
    <div className="results-wrapper">
      {output}
    </div>
  );
};

// Connects the Algolia searchState and searchResults to this component
// Learn more here: https://community.algolia.com/react-instantsearch/connectors/connectStateResults.html
export default connectStateResults(SearchResultsContainer);
