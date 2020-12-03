import React from 'react';
import { images } from 'assets';
import styles from './Texting.scss';

// Success sending view
const SentView = () => (
  <div className={styles.responseIcons}>
    <div className={styles.circle}>
      <img src={images.icon('check-mark')} alt="check-mark" className={styles.responseIcon} />
      <h1 className={styles.responseText} datafield="sent">Sent!</h1>
    </div>
  </div>
);

export default SentView;
