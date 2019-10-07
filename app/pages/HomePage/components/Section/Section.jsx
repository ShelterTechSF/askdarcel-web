import React from 'react';
import PropTypes from 'prop-types';

import styles from './Section.scss';

const Section = ({ title, description, children }) => (
  <section className={styles.section}>
    <div className={styles.content}>
      <h1 className={styles.title}>{ title }</h1>
      <div className={styles.description}>{ description }</div>
      { children }
    </div>
  </section>
);

Section.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.node,
};

Section.defaultProps = {
  description: undefined,
  children: undefined,
};

export default Section;
