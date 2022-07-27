import React from 'react';
import PropTypes from 'prop-types';

import styles from './CovidHeader.module.scss';

/** Common header shared across all COVID pages. */
export const CovidHeader = ({ headerText }) => (
  <header className={styles.header}>
    <h1>
      {headerText}
    </h1>
    <p>
      This list is compiled to link individuals experiencing homelessness to resources.
      We will be updating the list continuously, when services change.
      <br />
      Please email
      {' '}
      <a href="mailto:contact@sheltertech.org">contact@sheltertech.org</a>
      {' '}
      to suggest edits.
    </p>
  </header>
);

CovidHeader.propTypes = {
  headerText: PropTypes.string.isRequired,
};
