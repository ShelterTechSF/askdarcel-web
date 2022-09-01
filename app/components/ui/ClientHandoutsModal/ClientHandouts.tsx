import React from 'react';

import { Modal } from 'components/ui/Modal/Modal';
import { Button } from 'components/ui/inline/Button/Button';

import styles from './ClientHandouts.module.scss';

export const ClientHandouts = ({
  isOpen, setIsOpen, handoutCollection,
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
        <h2 className={styles.title}>Print Handout</h2>
        {handoutCollection.map(handout => (
          <a href={handout.link} target="_blank" rel="noreferrer" className={styles.handoutLink} key={handout.id}>
            {handout.description}
            {' '}
            - PDF
          </a>
        ))}

        <button onClick={closeModal} className={styles.closeBtn} tabIndex={0} type="button">
          Close
        </button>
      </div>
    </Modal>
  );
};

export default ClientHandouts;
