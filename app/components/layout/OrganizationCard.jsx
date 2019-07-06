import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router';
import StreetViewImage from 'components/maps/StreetViewImage';

class OrganizationCard extends React.Component {
  calculateShortDescription() {
    const { org } = this.props;
    // TODO This should be done better, so that we can ellipsis the text and
    // enforce height based on maxHeight
    return org.short_description || org.long_description.split('\n')[0];
  }

  render() {
    const { org, org: { id, address, name } } = this.props; // schedule
    const maxHeight = '106px';

    return (
      <Link to={{ pathname: '/resource', query: { id } }} className="card" style={{ maxHeight }}>
        <StreetViewImage address={address} size={maxHeight} />
        <header className="content">
          <h3>{ name }</h3>
          <h4>
            <span>{ address.address_1 }</span>
            {/* TODO Walking distance */}
          </h4>
          {/* TODO Add Rating */}
          {/* TODO HAP Certification */}
          <p>{ this.calculateShortDescription(org) }</p>
        </header>
      </Link>
    );
  }
}

OrganizationCard.propTypes = {
  org: PropTypes.object.isRequired,
};

export default OrganizationCard;
