import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { connectStateResults } from 'react-instantsearch/connectors';
import { icon } from 'assets';
import { SearchMap } from 'components/search/SearchMap/SearchMap';
import ResultsPagination from 'components/search/Pagination/ResultsPagination';
import { parseAlgoliaSchedule } from 'app/models';
import Texting from 'components/Texting';
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

const SearchResults = ({ searchResults, props }) => {
  if (!searchResults) return null;
  const [centerCoords, setCenterCoords] = useState(null);
  const [googleMapObject, setMapObject] = useState(null);

  // Todo: setExpandList will be used as part of next stage of multiple location work
  // eslint-disable-next-line no-unused-vars
  const { setExpandList, expandList } = props;
  const hits = transformHits(searchResults.hits);

  useEffect(() => {
    if (centerCoords) {
      googleMapObject.setCenter(centerCoords);
    }
  }, [centerCoords]);

  return (
    <div className={styles.searchMapContainer}>
      <div className={`${styles.searchResultsContainer} ${expandList ? styles.expandList : ''}`}>
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
        <ResultsPagination />
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

// eslint-disable-next-line no-unused-vars
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

  // Todo: to be included with next stage of multiple location work
  // const renderAddressMetadata = (hit_, hitIndex) => {
  //   const { addresses } = hit_;
  //   const hasNoAddress = !addresses || !addresses[0].address_1;
  //   if (hasNoAddress) {
  //     return <span>No address found</span>;
  //   }

  //   const addressMarkup = addresses.map((address, i) => {
  //     const isLastAddress = (i + 1) === addresses.length;
  //     const isSecondAddress = i === 1;
  //     const setAddressLabel = (serviceIndex, addressIndex) => {
  //       if (addressIndex > 0) {
  //         return ((serviceIndex + 1) + (addressIndex + 9).toString(36).toUpperCase());
  //       }
  //       return '';
  //     };

  //     return (
  //       <div
  //         // eslint-disable-next-line react/no-array-index-key
  //         key={`${address.address_1}.${i}`}
  //         className={isLastAddress ? styles.searchResult_addressLast
  //          : styles.searchResult_address}
  //       >
  //         {isSecondAddress && <h3>Other Locations</h3>}
  //         <p>
  //           <a className={styles.addressLabel}>{setAddressLabel(hitIndex, i)}</a>
  //           {address.address_1}
  //         </p>
  //         { i > 0 && (
  //           <div className={styles.sideLink}>
  //             <button
  //               type="button"
  //               className={styles.sideLinkText}
  //               onClick={() => {
  //                 setCenterCoords({ lat: address.latitude, lng: address.longitude });
  //               }}
  //             >
  //               <img src={icon('popout-blue')} alt="website" className={styles.sideLinkIcon} />
  //               Show on map
  //             </button>
  //           </div>
  //         )}
  //       </div>
  //     );
  //   });

  //   addressMarkup.unshift(<h3 key={hit_.id}>Location & Hours</h3>);
  //   return addressMarkup;
  // };

  const phoneNumber = hit?.phones?.[0]?.number;
  const formatPhoneNumber = number => {
    // Takes 9 or 10 digit raw phone number input and outputs xxx-xxx-xxxx
    // If the input doesn't match regex, function returns number's original value
    if (!number) {
      return '';
    }

    const cleaned = (number.toString()).replace(/\D/g, '');
    const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return [match[2], '-', match[3], '-', match[4]].join('');
    }

    return number;
  };

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
              <a href={`tel:${phoneNumber}`} className={styles.sideLinkText}>{`Call ${formatPhoneNumber(phoneNumber)}`}</a>
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