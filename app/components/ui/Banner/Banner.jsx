import React from 'react';
import styles from './Banner.module.scss';
/* eslint-disable max-len */

export default function Banner() {
  return (
    <div className={styles.bannerContainer}>
      <strong>COVID-19 VACCINE SITES: </strong>
      Find out where to get a vaccine if you&apos;re eligible&nbsp;
      <a href="https://sf.gov/vaccine-sites">HERE</a>
      <br />
      <strong>&nbsp;Need help applying for rent payment assistance?</strong>
      &nbsp;Check out Code Tenderloin&apos;s workshops&nbsp;
      <a href="https://docs.google.com/document/d/1t-RM30QQHA5UQdzIGHrD6kaFoBMrwmCBM7mEOBD8a9U/edit">HERE</a>
      <br />
      <a href="https://www.homeownershipsf.org/application-assistance-for-renters/">HERE</a>
    </div>
  );
}
