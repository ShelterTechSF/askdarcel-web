import React from 'react';
import { connectStateResults } from 'react-instantsearch/connectors';
import styles from './FoodResourcesSearchResults.scss';
import { parseAlgoliaSchedule } from 'utils/transformSchedule';
import { Loader } from 'components/ui';
import Filtering from 'components/search/Filtering';
import SearchTable from 'components/search/SearchTable';
import { Link } from 'react-router-dom';
import SearchMap from 'components/search/SearchMap';
import * as dataService from '../../../../utils/DataService';

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

const FoodResourcesSearchResults = ({ searchState, searchResults, searching }) => {
  // console.log(dataService.getResource(38));
  const renderAddressMetadata = (hit) => {
    console.log(hit);
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
  // console.log(renderAddressMetadata());
  // console.log('inside Food Resources Search Results');
  let output = null;
  // if (!searchResults && searching) {
  //   output = <Loader />;
  // } else if (searchResults && searchResults.nbHits === 0) {
  //   output = (
  //     <div>
  //       <p>
  //         No results have been found for
  //         {' '}
  //         {searchState.query}
  //       </p>
  //     </div>
  //   );
  // } else if (searchResults)
  if (searchResults) {
    const hits = transformHits(searchResults.hits);
    output = (
      <div>
        { hits.map((hit, index) => (
          <div className={styles.searchResult}>
            <div className={styles.searchText}>
              <div className={styles.title}>{ `${index + 1}. ${hit.name}`}</div>
              <div className={styles.address}>{renderAddressMetadata(hit)}</div>
              <div className={styles.description}>{hit.long_description}</div>
              <div className={styles.location}>{hit.location}</div>
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
    <div className={styles.FoodResourcesSearchResultsContainer}>
      {output}
    </div>
  );
};

// const FoodResourcesSearchResults = (props) => (
//   <div className={styles.FoodResourcesSearchResultsContainer}>
//     { props.searchResults.map((result, index) => (
//       <div className={styles.searchResult}>
//         <div className={styles.searchText}>
//           <div className={styles.title}>{ `${index + 1} ${result.title}`}</div>
//           <div className={styles.address}>{result.address}</div>
//           <div className={styles.description}>{result.description}</div>
//           <div className={styles.location}>{result.location}</div>
//         </div>
//         <div className={styles.sideLinks}>
//           {
//             result.call
//            && <div className={styles.sideLinkText}>{`Call ${result.call}`}</div>
//           }
//           {
//             (result.directions && result.address)
//            && (
//              <div className={styles.sideLinkText}>
//                <a href={result.directions}>Get directions</a>
//              </div>
//            )
//           }
//           <div />
//           {
//             result.website
//             && (
//               <div className={styles.sideLinkText}>
//                 <a href={result.website} className={styles.sideLinkText}>Go to Website</a>
//               </div>
//             )
//           }
//           {
//             (result.call || result.directions || result.website)
//            && <div className={styles.borderLine} />
//           }
//           <a href="http://localhost:8081/" className={styles.sideLinkText}>Report Error</a>
//         </div>
//       </div>
//     ))}
//   </div>
// );

// Connects the Algolia searchState and searchResults to this component
// Learn more here: https://community.algolia.com/react-instantsearch/connectors/connectStateResults.html
export default connectStateResults(FoodResourcesSearchResults);
// export default FoodResourcesSearchResults;
