import React from 'react';
import { images } from '../../assets';

import './Attribution.scss';

class Attribution extends React.Component {
  render() {
    const verifiedIcon = 'verified-resource';
    const updatedRecord = 'updated-record';
    const hapLink = 'https://medium.com/@Shelter_Tech/sheltertech-is-participating-'
      + 'in-the-benetech-service-net-pilot-in-the-san-francisco-bay-area-b28645d3dee6';

    return (
      <div>
        <p>
          <span className="verified-resource-icon-container">
            <img
              src={images.icon(verifiedIcon)}
              alt="Verified Resource"
              className="listing-menu--button-icon"
            />
          </span>
          <span className="verified-resource-text">Verified by HAP</span>
        </p>
        <p>
          <span className="verified-resource-icon-container">
            <img
              src={images.icon(updatedRecord)}
              alt="Updated Record"
              className="listing-menu--button-icon"
            />
          </span>
          <span className="verified-resource-text">We&apos;ve updated this record thanks to a</span>
          {' '}
          <a className="verified-resource-link" href={hapLink} target="_blank" rel="noopener noreferrer">
            Service Net Partner
          </a>
        </p>
      </div>
    );
  }
}

export default Attribution;
