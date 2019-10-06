import React from 'react';
import PropTypes from 'prop-types';

import styles from './HomePageHero.scss';


const HomePageHero = ({ title, description, imageURL }) => (
  <div className={styles.hero} style={{ backgroundImage: `url("${imageURL}")` }}>
    <div className={styles.content}>
      <div className={styles.textPane}>
        <h1 className={styles.title}>{ title }</h1>
        <div className={styles.description}>
          { description }
        </div>
      </div>
    </div>
  </div>
);


HomePageHero.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  imageURL: PropTypes.string,
};

HomePageHero.defaultProps = {
  description: undefined,
  imageURL: undefined,
};

export default HomePageHero;
