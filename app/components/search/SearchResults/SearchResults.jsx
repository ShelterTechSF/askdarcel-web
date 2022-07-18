import React, { useState, useEffect } from 'react';
import { connectStateResults } from 'react-instantsearch/connectors';
import { SearchMap } from 'components/search/SearchMap/SearchMap';
import ResultsPagination from 'components/search/Pagination/ResultsPagination';
import { parseAlgoliaSchedule } from 'app/models';
import { SearchResult } from './SearchResult';
import styles from './SearchResults.module.scss';


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

// Todo: setExpandList will be used as part of next stage of multiple location work
// eslint-disable-next-line no-unused-vars
const SearchResults = ({ searchResults, expandList, setExpandList }) => {
  if (!searchResults) return null;
  const [centerCoords, setCenterCoords] = useState(null);
  const [googleMapObject, setMapObject] = useState(null);
  const hits = transformHits(searchResults.hits);

  useEffect(() => {
    if (centerCoords) {
      googleMapObject.setCenter(centerCoords);
    }
  }, [centerCoords]);
  return (
    <div className={styles.searchResultsAndMapContainer}>
      <div className={`${styles.searchResultsContainer} ${expandList ? styles.expandList : ''}`}>
        <div className={`${styles.noResultsMessage} ${(hits && hits.length) ? styles.hidden : ''}`}>
          No results found in your area. Try a different location, category, or search term.
        </div>

        {/* <div className={styles.searchResultsTopShadow}></div> */}
        {/*
        // todo: to be included as part of next stage of multiple location work
        <button className={styles.expandListSlider} onClick={() => setExpandList(!expandList)}>
          SLIDER HERE
        </button> */}
        { hits.map((hit, index) => (
          <SearchResult
            hit={hit}
            index={index}
            setCenterCoords={setCenterCoords}
            key={hit.id}
          />
        ))}
        <ResultsPagination noResults={(!hits || !hits.length)} />
      </div>
      <SearchMap
        hits={hits}
        page={0}
        hitsPerPage={hits.length}
        setMapObject={setMapObject}
      />
    </div>
  );
};

// Connects the Algolia searchState and searchResults to this component
// Learn more here: https://community.algolia.com/react-instantsearch/connectors/connectStateResults.html
export default connectStateResults(SearchResults);
