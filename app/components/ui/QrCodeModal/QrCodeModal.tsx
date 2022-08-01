import React from 'react';
import Modal from 'react-modal';
import { QRCodeSVG } from 'qrcode.react';

import { icon } from 'assets';
import { Button } from 'components/ui/inline/Button';

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
      className={styles.qrCodeModal}
      overlayClassName={styles.qrCodeModalOverlay}
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
      <QRCodeSVG value={window.location.href} size={235} />
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
