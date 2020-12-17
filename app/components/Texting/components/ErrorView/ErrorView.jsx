import React from 'react';
import { images } from 'assets';
import styles from './ErrorView.module.scss';

// Error View: show Alert graphic and a friendly message
const ErrorView = () => (
  <div className={styles.errorDiv}>
    <img className={styles.responseIcon} src={images.icon('emergency')} alt="error" />
    <div className={styles.errorText}>
      Sorry, something went wrong, please try again later.
    </div>
  </div>

);

export default ErrorView;
