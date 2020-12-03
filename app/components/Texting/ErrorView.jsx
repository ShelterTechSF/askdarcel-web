import React from 'react';
import { images } from 'assets';
import styles from './Texting.scss';

// Error View: show Alert graphic and a friendly message
const ErrorView = () => (
  <div className={`${styles.responseIcons} ${styles.error}`}>
    <img src={images.icon('emergency')} alt="error" className={styles.responseIcon} />
    <h1 className="responseText error">Sorry, something went wrong, please try again later.</h1>
  </div>
);

export default ErrorView;
