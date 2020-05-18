import React from 'react';
import styles from './FoodResourcesSearchResults.scss';

const FoodResourcesSearchResults = ({ searchResults }) => (
  <div className={styles.FoodResourcesSearchResultsContainer}>
    { searchResults.map((result, index) => (
      <div className={styles.searchResult}>
        <div className={styles.searchText}>
          <div className={styles.title}>{ `${index + 1} ${result.title}`}</div>
          <div className={styles.address}>{result.address}</div>
          <div className={styles.description}>{result.description}</div>
          <div className={styles.location}>{result.location}</div>
        </div>
        <div className={styles.sideLinks}>
          {
            result.call
           && <div className={styles.sideLinkText}>{`Call ${result.call}`}</div>
          }
          {
            (result.directions && result.address)
           && (
             <div className={styles.sideLinkText}>
               <a href={result.directions}>Get directions</a>
             </div>
           )
          }
          <div />
          {
            result.website
            && (
              <div className={styles.sideLinkText}>
                <a href={result.website} className={styles.sideLinkText}>Go to Website</a>
              </div>
            )
          }
          {
            (result.call || result.directions || result.website)
           && <div className={styles.borderLine} />
          }
          <a href="http://localhost:8081/" className={styles.sideLinkText}>Report Error</a>
        </div>
      </div>
    ))}
  </div>
);

export default FoodResourcesSearchResults;
