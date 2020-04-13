import React from 'react';
import PropTypes from 'prop-types';
import Iframe from 'react-iframe';

import styles from './SimpleGuide.scss';


const SimpleGuide = ({ pageHeader, googleDocURL }) => (
  <article className={styles.page}>
    <header className={styles.header}>
      <h1>
        {pageHeader}
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
    <section>
      <Iframe
        title={pageHeader}
        url={googleDocURL}
        width="80%"
        height="100%"
        padding="0pt"
        allowFullScreen="yes"
        className={styles.googleDocEmbed}
      />
    </section>
  </article>
);

SimpleGuide.propTypes = {
  pageHeader: PropTypes.string.isRequired,
  googleDocURL: PropTypes.string.isRequired,
};

export default SimpleGuide;
