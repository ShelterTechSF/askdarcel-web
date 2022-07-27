import React from 'react';
import { icon } from 'assets';
import styles from './SentView.module.scss';

// Success sending view
export const SentView = () => (
  <div className={styles.successDiv}>
    <div className={styles.circle}>
      <img className={styles.responseIcon} src={icon('check-mark')} alt="Success" />
      <div className={styles.successText} data-field="sent">Sent!</div>
    </div>
  </div>
);
