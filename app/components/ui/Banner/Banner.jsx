import React from 'react';
import styles from './Banner.scss';

export default function Banner() {
  return (
    <div className={styles.bannerContainer}>
      <span>
        <strong>CORONAVIRUS UPDATE: </strong>
        Many organizations and services have reduced hours and availability.
      </span>
    </div>
  );
}
