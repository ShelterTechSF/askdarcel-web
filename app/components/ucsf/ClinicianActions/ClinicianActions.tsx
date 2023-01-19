import React from 'react';
import ReactMarkdown from 'react-markdown';

import { Modal } from 'components/ui/Modal/Modal';
import { Button } from 'components/ui/inline/Button/Button';

import styles from './ClinicianActions.module.scss';

export const ClinicianActions = ({
  isOpen,
  setIsOpen,
  actions,
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  actions: string;
}) => {
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      addModalClass={styles.clinicianActions}
      closeModal={closeModal}
    >
      <div className={styles.modalContent}>
        <h2 className={styles.title}>Actions</h2>
        <div className={styles.actionContainer}>
          <ReactMarkdown className="rendered-markdown" source={actions} />
        </div>
        <div className={styles.buttonBar}>
          <Button onClick={closeModal} addClass={styles.closeBtn} tabIndex={0}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
