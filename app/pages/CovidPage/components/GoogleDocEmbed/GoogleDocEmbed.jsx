import React from 'react';
import PropTypes from 'prop-types';
import Iframe from 'react-iframe';

import styles from './GoogleDocEmbed.module.scss';

export function GoogleDocEmbed({ title, embedURL }) {
  return (
    <section>
      <Iframe
        title={title}
        url={embedURL}
        width="80%"
        height="100%"
        padding="0pt"
        allowFullScreen="yes"
        className={styles.googleDocEmbed}
      />
    </section>
  );
}

GoogleDocEmbed.propTypes = {
  title: PropTypes.string.isRequired,
  embedURL: PropTypes.string.isRequired,
};
