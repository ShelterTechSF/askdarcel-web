import React from 'react';
import ServiceVerified from '../../assets/img/ic-verified-record.svg';

import './ServiceAttribution.scss';

class ServiceAttribution extends React.Component {
  isVerified() {
    const { attribution, status } = this.props;
    return attribution === 'service_net' && status === 'approved';
  }

  render() {
    const hapLink = 'https://medium.com/@Shelter_Tech/sheltertech-is-participating-'
      + 'in-the-benetech-service-net-pilot-in-the-san-francisco-bay-area-b28645d3dee6';

    return this.isVerified() ? (
      <div className="verified-service">
        <p className="verified-service-resource-text">
          <span className="verified-resource-icon-container">
            <img
              src={ServiceVerified}
              alt="Record Verified by Service Net partner"
              className="listing-menu--button-icon"
            />
          </span>
          <span className="verified-resource-text">We&apos;ve updated this record thanks to a </span>
          <a className="verified-resource-link" href={hapLink} target="_blank" rel="noopener noreferrer">
            Service Net Partner
          </a>
        </p>
      </div>
    ) : null;
  }
}

export default ServiceAttribution;
