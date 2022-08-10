import React from 'react';
import { icon } from 'assets';
import styles from './Banner.module.scss';

export const Banner = () => (
  <div className={styles.bannerContainer}>
    <div className={styles.bannerContent}>
      <img src={icon('alert')} alt="attention" className={styles.alertIcon} />
      <strong className={styles.title}>MONKEYPOX VACCINE INFORMATION: </strong>
      Find out where to get a vaccine and if you&apos;re eligible.
      Find a
      {' '}
      <a className={styles.bannerLink} target="_blank" rel="noreferrer" href="https://sf.gov/information/monkeypox-vaccine">site near you</a>
      .
    </div>
  </div>
);
