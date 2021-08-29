import React from 'react';
import configurations from '../../../../utils/whitelabel';
import styles from './ErrorView.module.scss';

const { appImages: { icon } } = configurations;

// Error View: show Alert graphic and a friendly message
const ErrorView = () => (
  <div className={styles.errorDiv}>
    <img className={styles.responseIcon} src={icon('emergency')} alt="error" />
    <div className={styles.errorText}>
      Sorry, something went wrong, please try again later.
    </div>
  </div>

);

export default ErrorView;
