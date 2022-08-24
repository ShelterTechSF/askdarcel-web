import React from 'react';
import Modal from 'react-modal';

import { icon } from 'assets';
import { Button } from 'components/ui/inline/Button/Button';

import styles from './ClinicianActions.module.scss';

export const ClinicianActions = ({
  isOpen, setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}) => {
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      className={styles.clinicianActions}
      overlayClassName={styles.clinicianActionsOverlay}
      onRequestClose={closeModal}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={closeModal}
      >
        <img
          src={icon('close')}
          alt="close"
          className={styles.closeModal}
        />
      </div>
      <h2 className={styles.title}>Resource Code</h2>
      <p className={styles.body}>
        Scan this QR code with a mobile phone to open this page.
      </p>
      <div>
        <Button
          onClick={closeModal}
          addClass={styles.closeBtn}
          tabIndex={0}
        >
          CLOSE
        </Button>
      </div>
    </Modal>
  );
};

