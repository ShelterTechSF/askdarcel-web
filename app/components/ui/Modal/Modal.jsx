import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import Modal from 'react-modal';

import styles from './Modal.scss';

export const BaseModal = props => {
  const {
    backButtonText, closeModal, modalContent, modalFooter, isFullScreen,
  } = props;

  const modalBody = isFullScreen ? (
    <Fragment>
      <div className={styles.fullscreenModalHeader}>
        <div className={styles.fullscreenModalBackButton} role="button" onClick={e => { e.stopPropagation(); closeModal(); }} tabIndex="0">
          <i className="material-icons">keyboard_arrow_left</i>
          {backButtonText}
        </div>
      </div>
      <div className={
        modalFooter ? styles.fullscreenModalBodyWithFooter : styles.fullscreenModalBody}
      >
        {modalContent}
      </div>
      {modalFooter}
    </Fragment>
  ) : null;

  return (
    <Modal
      className={isFullScreen ? styles.fullScreenModalContent : styles.baseModalContent}
      overlayClassName={styles.baseModalOverlay}
      appElement={document.getElementById('root')}
      {...props}
    >
      {modalBody}
    </Modal>
  );
};

BaseModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  backButtonText: PropTypes.string,
  closeModal: PropTypes.func,
  modalContent: PropTypes.element,
  /**
   * Defaults to false. When false, the modal displays as a standard floating
   * modal with a static overlay behind it. When true, the modal expands to fit
   * the full screen, so no overlay is visible.
   */
  isFullScreen: PropTypes.bool,
};

BaseModal.defaultProps = {
  backButtonText: null,
  closeModal: noop,
  modalContent: null,
  isFullScreen: false,
};
