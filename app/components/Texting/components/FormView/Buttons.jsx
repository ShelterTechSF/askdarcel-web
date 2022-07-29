import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './Form.module.scss';

const Buttons = ({ closeModal, onSubmit, disabled }) => (
  <div className={styles.buttons}>
    <button
      type="button"
      className={classNames(styles.cancel, styles.button)}
      onClick={closeModal}
    >
      Cancel
    </button>
    <button
      type="submit"
      className={classNames(styles.button, { [styles.disabled]: disabled })}
      disabled={disabled}
      onClick={onSubmit}
    >
      Text me
    </button>
  </div>
);

Buttons.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default Buttons;
