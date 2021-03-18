import React from 'react';
import { images } from 'assets';
import styles from './SentView.module.scss';

// Success sending view
const SentView = () => (
  <div className={styles.successDiv}>
    <div className={styles.circle}>
      <img className={styles.responseIcon} src={images.icon('check-mark')} alt="Success" />
      <div className={styles.successText} data-field="sent">Sent!</div>
    </div>
  </div>
);

export default SentView;
