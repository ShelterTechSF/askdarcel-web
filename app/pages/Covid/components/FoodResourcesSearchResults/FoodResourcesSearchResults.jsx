import React from 'react';
import { connectStateResults } from 'react-instantsearch/connectors';
import { parseAlgoliaSchedule } from 'utils/transformSchedule';
import styles from './FoodResourcesSearchResults.scss';

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

const FoodResourcesSearchResults = ({ searchResults }) => {
  const renderAddressMetadata = (hit) => {
    if (hit.addresses.length === 0) {
      return <span>No address found</span>;
    }
    if (hit.addresses.length > 1) {
      return <span>Multiple locations</span>;
    }
    if (hit.addresses[0].address_1) {
      return <span>{hit.addresses[0].address_1}</span>;
    }
    return <span>No address found</span>;
  };

  let resultLength = 0;
  let output;
  if (searchResults) {
    const hits = transformHits(searchResults.hits);
    resultLength = searchResults.hits.length;
    output = (
      <div>
        { hits.map((hit, index) => (
          <div className={styles.searchResult} key={hit.id}>
            <div className={styles.searchText}>
              <div className={styles.title}>{ `${index + 1}. ${hit.name}`}</div>
              <div className={styles.address}>{renderAddressMetadata(hit)}</div>
              <div className={styles.description}>{hit.long_description}</div>
              <div className={styles.location}>{hit.service_of}</div>
            </div>
            <div className={styles.sideLinks}>
              {
                // hit.call
                // && <div className={styles.sideLinkText}>{`Call ${hit.call}`}</div>
                <div className={styles.sideLinkText}>Call 211</div>
              }
              {
                // (hit.directions && hit.address)
                // && (
                //   <div className={styles.sideLinkText}>
                //     <a href={hit.directions}>Get directions</a>
                //   </div>
                // )
                <div className={styles.sideLinkText}>
                  <a href="http://localhost:8081/">Get directions</a>
                </div>
              }
              <div />
              {
                // hit.website
                // && (
                //   <div className={styles.sideLinkText}>
                //     <a href={hit.website} className={styles.sideLinkText}>Go to Website</a>
                //   </div>
                // )
                <div className={styles.sideLinkText}>
                  <a href="http://localhost:8081/"> Go to Website</a>
                </div>
              }
              {
                // (hit.call || hit.directions || hit.website)
                // && <div className={styles.borderLine} />
                <div className={styles.borderLine} />
              }
              <a href="http://localhost:8081/" className={styles.sideLinkText}>Report Error</a>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className={styles.searchResultsAmount}>{`${resultLength} RESULTS`}</div>
      <div className={styles.FoodResourcesSearchResultsContainer}>
        {output}
      </div>
    </div>
  );
};

// Connects the Algolia searchState and searchResults to this component
// Learn more here: https://community.algolia.com/react-instantsearch/connectors/connectStateResults.html
export default connectStateResults(FoodResourcesSearchResults);
