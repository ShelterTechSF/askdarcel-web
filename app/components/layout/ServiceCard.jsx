import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router';
// import StreetViewImage from 'components/maps/StreetViewImage';
// import RelativeOpeningTime from 'components/listing/RelativeOpeningTime';

class ServiceCard extends React.Component {
  render() {
    const { service: { id, name, long_description } } = this.props;

    return (
      <Link to={{ pathname: `/service/${id}` }} className="card">
        <header className="content">
          <h3>{ name }</h3>
          <p>{ long_description }</p>
        </header>
      </Link>
    );
  }
}

ServiceCard.propTypes = {
  service: PropTypes.object.isRequired,
};

export default ServiceCard;
