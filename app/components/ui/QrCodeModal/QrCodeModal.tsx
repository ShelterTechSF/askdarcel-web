import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

import { Modal } from 'components/ui/Modal/Modal';
import { Button } from 'components/ui/inline/Button/Button';

import styles from './QrCodeModal.module.scss';

export const QrCodeModal = ({
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
      addModalClass={styles.qrCodeModal}
      closeModal={closeModal}
    >
      <div className={styles.modalContent}>
        <div className={styles.description}>
          <h2 className={styles.title}>Resource Code</h2>
          <p className={styles.body}>
            Scan this QR code with a mobile phone
            <br />
            to open this page.
          </p>
        </div>
        <QRCodeSVG value={window.location.href} size={235} />
        <div>
          <Button
            onClick={closeModal}
            addClass={styles.closeBtn}
            tabIndex={0}
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
