import React from 'react';
import { icon } from 'assets';
import styles from './ErrorView.module.scss';

// Error View: show Alert graphic and a friendly message
export const ErrorView = () => (
  <div className={styles.errorDiv}>
    <img className={styles.responseIcon} src={icon('emergency')} alt="error" />
    <div className={styles.errorText}>
      Sorry, something went wrong, please try again later.
    </div>
  </div>
);
