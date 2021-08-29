import React from 'react';
import configurations from '../../../../utils/whitelabel';
import styles from './SentView.module.scss';

const { appImages: { icon } } = configurations;

// Success sending view
const SentView = () => (
  <div className={styles.successDiv}>
    <div className={styles.circle}>
      <img className={styles.responseIcon} src={icon('check-mark')} alt="Success" />
      <div className={styles.successText} data-field="sent">Sent!</div>
    </div>
  </div>
);

export default SentView;
