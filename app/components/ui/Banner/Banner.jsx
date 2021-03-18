import React from 'react';
import styles from './Banner.module.scss';
/* eslint-disable max-len */

export default function Banner() {
  return (
    <div className={styles.bannerContainer}>
      <strong>CORONAVIRUS COVID-19 UPDATE: </strong>
      Starting March 15, you will be elegible if you have certain health conditions, disabilities, or live or work in congregate settings. More&nbsp;
      <a href="https://sf.gov/information/other-conditions-eligible-covid-19-vaccine-starting-march-15">HERE</a>
    </div>
  );
}
