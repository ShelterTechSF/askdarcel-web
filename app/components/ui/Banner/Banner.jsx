import React from 'react';
import styles from './Banner.module.scss';
/* eslint-disable max-len */

export default function Banner() {
  return (
    <div className={styles.bannerContainer}>
      <strong>CORONAVIRUS COVID-19: </strong>
      Get notified when it is your turn for the COVID-19 Vaccine and other relevant information <a href="https://sf.gov/covid-19-vaccine-san-francisco">HERE</a>
    </div>
  );
}
