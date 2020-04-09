import React from 'react';
import styles from './Banner.scss';

export default function Banner() {
  return (
    <div className={styles.bannerContainer}>
      <strong>CORONAVIRUS COVID-19: </strong>
      Many organizations and services have reduced hours and availability. See our new
      {' '}
      <a className={styles.bannerLink} target="_blank" href="/covid">Resource Guide</a>
      {' '}
      - updated daily.
    </div>
  );
}
