import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { icon } from 'assets';
import Texting from 'components/Texting';
import { StreetViewImage } from 'components/listing';
import Modal from 'react-modal';
import styles from './SearchResult.module.scss';

const StreetView = ({ address }) => <StreetViewImage address={address} size="100%" />;

// eslint-disable-next-line no-unused-vars
export const SearchResult = ({ hit, index, setCenterCoords }) => {
  const [textingIsOpen, setTextingIsOpen] = useState(false);
  const [svIsOpen, setSvIsOpen] = useState(false);

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
  // Href structure varies depending on whether the hit is a resource or location
  let basePath = 'organizations';
  let entryId = resourceId;
  if (hit.type === 'service') {
    basePath = 'services';
    entryId = serviceId;
  }

  return (
    <div className={styles.searchResult}>
      { textingIsOpen
        && <Texting closeModal={toggleTextingModal} service={service} isShowing={textingIsOpen} />
      }
      {
        svIsOpen && (
          <Modal
            isOpen={svIsOpen}
            className={styles.streetViewModal}
            overlayClassName="feedback__Overlay"
            onRequestClose={() => setSvIsOpen(false)}
          >
            <div
              className={styles.closeModal}
              role="button"
              tabIndex="0"
              onClick={() => setSvIsOpen(false)}
            >
              <img src={icon('close')} alt="close" />
            </div>
            <StreetView address={hit.addresses[0]} />
          </Modal>
        )
      }
      <div className={styles.searchText}>
        <div className={styles.title}>
          <Link to={{ pathname: `/${basePath}/${entryId}` }}>{`${index + 1}. ${hit.name}`}</Link>
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
        <div className={styles.sideLink} role="button" tabIndex={-1} onClick={() => setSvIsOpen(true)}>
          <img src={icon('text-message')} alt="chat-bubble" className={styles.sideLinkIcon} />
          <div className={styles.sideLinkText}>Street View</div>
        </div>
      </div>
    </div>
  );
};
