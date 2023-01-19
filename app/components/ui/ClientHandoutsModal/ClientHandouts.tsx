import React from 'react';

import { icon } from 'assets';

import { Modal } from 'components/ui/Modal/Modal';
import { Button } from 'components/ui/inline/Button/Button';

import styles from './ClientHandouts.module.scss';

export const ClientHandouts = ({
  isOpen,
  setIsOpen,
  handoutCollection,
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  handoutCollection: any[];
}) => {
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      addModalClass={styles.clientHandoutModal}
      closeModal={closeModal}
    >
      <div className={styles.modalContent}>
        <h2 className={styles.title}>Print</h2>
        {handoutCollection.map((handout) => (
          <a
            href={handout.url}
            target="_blank"
            rel="noreferrer"
            className={styles.handoutLink}
            key={handout.id}
          >
            <img
              src={icon('pdf-red')}
              alt="PDF icon"
              className={styles.sideLinkIcon}
            />
            <span>{handout.description} - PDF</span>
          </a>
        ))}
        <div className={styles.buttonBar}>
          <Button onClick={closeModal} tabIndex={0}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ClientHandouts;
