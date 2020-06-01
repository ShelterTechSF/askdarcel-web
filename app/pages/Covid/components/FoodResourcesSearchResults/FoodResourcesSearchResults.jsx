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
    console.log(searchResults);
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
                hit.phones[0].number
                && (
                  <div className={styles.sideLinkText}>
                    <a href={`tel${hit.phones[0].number}`}>{`Call ${hit.phones[0].number}`}</a>
                  </div>
                )
              }
              {
                (hit._geoloc && hit.addresses[0].address_1)
                && (
                  <div className={styles.sideLinkText}>
                    <a href={`http://google.com/maps/dir/?api=1&destination=${hit._geoloc}`}>Get directions</a>
                  </div>
                )
              }
              <div />
              {
                hit.url
                && (
                  <div className={styles.sideLinkText}>
                    <a href={hit.url} className={styles.sideLinkText}>Go to Website</a>
                  </div>
                )
              }
              {
                (hit.phones[0].number || hit._geoloc || hit.url)
                && <div className={styles.borderLine} />
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
