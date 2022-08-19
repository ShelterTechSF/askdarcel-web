import React from 'react';
import PropTypes from 'prop-types';

import styles from './Section.module.scss';

export const HomePageSection = ({
  title, description, children,
}) => (
  <section className={styles.section}>
    <div className={styles.content}>
      <h1 className={styles.title}>{ title }</h1>
      <div className={styles.description}>{ description }</div>
      { children }
    </div>
  </section>
);

HomePageSection.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.node,
};

HomePageSection.defaultProps = {
  description: undefined,
  children: undefined,
};
