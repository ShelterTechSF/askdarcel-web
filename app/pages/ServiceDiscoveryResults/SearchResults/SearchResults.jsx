import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { get as _get } from 'lodash';
import { connectStateResults } from 'react-instantsearch/connectors';
import { icon } from 'assets';
import styles from './SearchResults.module.scss';
import { parseAlgoliaSchedule } from '../../../models';
import Texting from '../../../components/Texting';

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
  const [textingIsOpen, setTextingIsOpen] = useState(false);
  const service = {
    serviceName: hit.name,
    serviceId: hit.service_id,
  };

  const toggleTextingModal = () => setTextingIsOpen(!textingIsOpen);

  const texting = (
    <div className={styles.sideLink} data-field="text-me" role="button" tabIndex={0} onClick={toggleTextingModal}>
      <img src={icon('text-message')} alt="chat-bubble" className={styles.sideLinkIcon} />
      <div className={styles.sideLinkText}>Text me the info</div>
    </div>
  );

  const renderAddressMetadata = hit_ => {
    if (!hit_.addresses || hit_.addresses.length === 0) {
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

  const phoneNumber = _get(hit, 'phones[0].number');
  const url = hit.url || hit.website;
  const serviceId = hit.service_id;
  const resourceId = hit.resource_id;

  return (
    <div className={styles.searchResult}>
      { textingIsOpen
        && <Texting closeModal={toggleTextingModal} service={service} isShowing={textingIsOpen} />
      }
      <div className={styles.searchText}>
        <div className={styles.title}>
          <Link to={`/services/${serviceId}`}>{`${index + 1}. ${hit.name}`}</Link>
        </div>
        <div className={styles.serviceOf}>
          <Link to={`/organizations/${resourceId}`}>{hit.service_of}</Link>
        </div>
        <div className={styles.address}>{renderAddressMetadata(hit)}</div>
        <ReactMarkdown className={`rendered-markdown ${styles.description}`} source={hit.long_description} />
      </div>
      <div className={styles.sideLinks}>
        {
          phoneNumber
          && (
            <div className={styles.sideLink}>
              <img src={icon('phone-blue')} alt="phone" className={styles.sideLinkIcon} />
              <a href={`tel:${phoneNumber}`} className={styles.sideLinkText}>{`Call ${phoneNumber}`}</a>
            </div>
          )
        }
        <div />
        {
          url
          && (
            <div className={styles.sideLink}>
              <img src={icon('popout-blue')} alt="website" className={styles.sideLinkIcon} />
              <a target="_blank" rel="noopener noreferrer" href={url} className={styles.sideLinkText}>Go to website</a>
            </div>
          )
        }
        { texting }
      </div>
    </div>
  );
};

// Connects the Algolia searchState and searchResults to this component
// Learn more here: https://community.algolia.com/react-instantsearch/connectors/connectStateResults.html
export default connectStateResults(SearchResults);
