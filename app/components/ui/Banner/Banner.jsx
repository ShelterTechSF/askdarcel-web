import React from 'react';
import styles from './Banner.module.scss';
/* eslint-disable max-len */

export default function Banner() {
  return (
    <div className={styles.bannerContainer}>
      <strong>COVID-19 VACCINE SITES: </strong>
      Find out where to get a vaccine if you’re eligible&nbsp;
      <a href="https://sf.gov/vaccine-sites">HERE</a>
    </div>
  );
}
