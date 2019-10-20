import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
// import StreetViewImage from 'components/maps/StreetViewImage';

class ServiceCard extends React.Component {
  render() {
    const { service: { id, name, long_description } } = this.props;

    return (
      <Link to={{ pathname: `/services/${id}` }} className="card">
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
