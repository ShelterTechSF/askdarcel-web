import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../Texting.scss';


const Buttons = ({ toggle, onSubmit, disabled }) => (
  <div className={styles.buttons}>
    <button
      type="button"
      className={`${styles.cancel} ${styles.button}`}
      onClick={toggle}
    >
      cancel
    </button>
    <button
      type="submit"
      className={`${styles.button} ${!disabled ? '' : styles.disabled}`}
      disabled={disabled}
      datafield="submit"
      onClick={onSubmit}
    >
      Text me
    </button>
  </div>
);

Buttons.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default Buttons;
