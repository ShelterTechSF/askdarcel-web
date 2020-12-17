import React from 'react';
import PropTypes from 'prop-types';
import styles from './Form.module.scss';


const Heading = ({ serviceName }) => (
  <div>
    <div className={styles.title}>
      Text me information for {serviceName}
    </div>
    <h3 className={styles.description}>
      You will receive their address and phone number.
    </h3>
  </div>
);

Heading.propTypes = {
  serviceName: PropTypes.string.isRequired,
};

export default Heading;
