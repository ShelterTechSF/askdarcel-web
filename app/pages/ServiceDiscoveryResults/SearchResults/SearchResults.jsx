import React from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { connectStateResults } from 'react-instantsearch/connectors';
import { parseAlgoliaSchedule } from 'utils/transformSchedule';
import { images } from 'assets';
import styles from './SearchResults.scss';

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

const SearchResults = ({ searchResults }) => {
  if (!searchResults) return null;

  const hits = transformHits(searchResults.hits);

  return (
    <div className={styles.searchResultsContainer}>
      <div>
        { hits.map((hit, index) => <SearchResult hit={hit} index={index} key={hit.id} />) }
      </div>
    </div>
  );
};

const SearchResult = ({ hit, index }) => {
  const renderAddressMetadata = hit_ => {
    if (hit_.addresses.length === 0) {
      return <span>No address found</span>;
    }
    if (hit_.addresses.length > 1) {
      return <span>Multiple locations</span>;
    }
    if (hit_.addresses[0].address_1) {
      return <span>{hit_.addresses[0].address_1}</span>;
    }
    return <span>No address found</span>;
  };

  const url = hit.url || hit.website;
  const serviceId = hit.service_id;
  const resourceId = hit.resource_id;

  return (
    <div className={styles.searchResult}>
      <div className={styles.searchText}>
        <div className={styles.title}>
          <Link to={`/services/${serviceId}`}>{`${index + 1}. ${hit.name}`}</Link>
        </div>
        <div className={styles.address}>{renderAddressMetadata(hit)}</div>
        <ReactMarkdown className={`rendered-markdown ${styles.description}`} source={hit.long_description} />
        <div className={styles.serviceOf}>
          <Link to={`/organizations/${resourceId}`}>{hit.service_of}</Link>
        </div>
      </div>
      <div className={styles.sideLinks}>
        {
          url
          && (
            <div className={styles.sideLink}>
              <img src={images.icon('popout-blue')} alt="website" className={styles.sideLinkIcon} />
              <a target="_blank" rel="noopener noreferrer" href={url} className={styles.sideLinkText}>Go to website</a>
            </div>
          )
        }
      </div>
    </div>
  );
};

// Connects the Algolia searchState and searchResults to this component
// Learn more here: https://community.algolia.com/react-instantsearch/connectors/connectStateResults.html
export default connectStateResults(SearchResults);
