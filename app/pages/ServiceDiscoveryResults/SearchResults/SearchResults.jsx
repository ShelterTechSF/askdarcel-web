import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { get as _get } from 'lodash';
import { connectStateResults } from 'react-instantsearch/connectors';
import { icon } from 'assets';
import { SearchMap } from 'components/search/SearchMap';
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
  const [centerCoords, setCenterCoords] = useState(null);
  const [googleMapObject, setMapObject] = useState(null);
  const hits = transformHits(searchResults.hits);

  useEffect(() => {
    if (centerCoords) {
      googleMapObject.setCenter(centerCoords);
    }
    // todo check if place center coords here
  }, [centerCoords]);

  return (
    <div className={styles.searchMapContainer}>
      <div className={styles.searchResultsContainer}>
        { hits.map((hit, index) => (
          <SearchResult
            hit={hit}
            index={index}
            setCenterCoords={setCenterCoords}
            key={hit.id}
          />
        ))}
      </div>
      <SearchMap
        className={styles.resultsMap}
        hits={hits}
        page={0}
        hitsPerPage={hits.length}
        setMapObject={setMapObject}
      />
    </div>
  );
};


const SearchResult = ({ hit, index, setCenterCoords }) => {
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
    const { addresses } = hit_;
    const hasNoAddress = !addresses || !addresses[0].address_1;
    if (hasNoAddress) {
      return <span>No address found</span>;
    }

    const addressMarkup = addresses.map((address, i) => {
      const isLastAddress = (i + 1) === addresses.length;
      const isSecondAddress = i === 1;

      return (
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={`${address.address_1}.${i}`}
          className={isLastAddress ? styles.searchResult_addressLast : styles.searchResult_address}
        >
          {isSecondAddress && <h3>Other Locations</h3>}
          <p>{address.address_1}</p>
          { i > 0 && (
            <div className={styles.sideLink}>
              <button
                type="button"
                className={styles.sideLinkText}
                onClick={() => {
                  setCenterCoords({ lat: address.latitude, lng: address.longitude });
                }}
              >
                <img src={icon('popout-blue')} alt="website" className={styles.sideLinkIcon} />
                Show on map
              </button>
            </div>
          )}
        </div>
      );
    });

    addressMarkup.unshift(<h3 key={hit_.id}>Location & Hours</h3>);
    return addressMarkup;
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
        <ReactMarkdown className={`rendered-markdown ${styles.description}`} source={hit.long_description} />
        <div className={styles.address}>{renderAddressMetadata(hit)}</div>
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
