import React from 'react';
import styles from './Banner.module.scss';
/* eslint-disable max-len */

export default function Banner() {
  return (
    <div className={styles.bannerContainer}>
      <strong>COVID-19 VACCINE SITES: </strong>
      Find out where to get a vaccine if you&apos;re eligible for a vaccine&#44; find a&nbsp;
      <a target="_blank" rel="noreferrer" href="https://sf.gov/vaccine-sites">site near you</a>
      .
      <br />
      <strong>Need help applying for rent payment assistance?</strong>
      {' '}
      Check out
      {' '}
      <a target="_blank" rel="noreferrer" href="https://docs.google.com/document/d/1t-RM30QQHA5UQdzIGHrD6kaFoBMrwmCBM7mEOBD8a9U/edit">Code Tenderloin&apos;s workshops</a>
      {' '}
      and
      {' '}
      <a target="_blank" rel="noreferrer" href="https://www.homeownershipsf.org/application-assistance-for-renters/">HomeownershipSF&apos;s resources</a>
      .
    </div>
  );
}
