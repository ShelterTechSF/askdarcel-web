import React from 'react';
import ServiceVerified from '../../assets/img/ic-attributed-record.svg';

import './ServiceAttribution.scss';

class ServiceAttribution extends React.Component {
  isServiceNetAttribution() {
    const { attribution, status } = this.props;
    return attribution === 'service_net' && status === 'approved';
  }

  render() {
    const benetechLink = 'https://medium.com/@Shelter_Tech/sheltertech-is-participating-'
      + 'in-the-benetech-service-net-pilot-in-the-san-francisco-bay-area-b28645d3dee6';

    return this.isServiceNetAttribution() && (
      <div className="attributed-service">
        <p className="attributed-service-resource-text">
          <span className="attributed-service-icon-container">
            <img
              src={ServiceVerified}
              alt="Record Verified by Service Net partner"
              className="listing-menu--button-icon"
            />
          </span>
          <span className="attributed-service-text">We&apos;ve updated this record thanks to a </span>
          <a className="attributed-service-link" href={benetechLink} target="_blank" rel="noopener noreferrer">
            Service Net Partner
          </a>
        </p>
      </div>
    );
  }
}

export default ServiceAttribution;
