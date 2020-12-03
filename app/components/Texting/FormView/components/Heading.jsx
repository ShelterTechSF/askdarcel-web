import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styles from '../../Texting.scss';


const Heading = ({ resource_name }) => (
  <Fragment>
    <h1 className={styles.title}>
      {`Text me information for ${resource_name}`}
    </h1>
    <h3 className={styles.description}>
      You will receive their address and phone number.
    </h3>
  </Fragment>
);

Heading.propTypes = {
  resource_name: PropTypes.string.isRequired,
};

export default Heading;
