import React from 'react';
import Modal from 'react-modal';
import { QRCodeSVG } from 'qrcode.react';

import { icon } from 'assets';
import Button from 'components/ui/inline/Button';

import styles from './QrCodeModal.module.scss';

const QrCodeModal = ({
  isOpen, setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}) => {
  const closeModal = () => {
    setIsOpen(false)
  };

  return (
    <Modal
      isOpen={isOpen}
      className={styles.qrCodeModal}
      overlayClassName={styles.qrCodeModalOverlay}
      onRequestClose={closeModal}
    >
      <img
        src={icon('close')}
        alt="close"
        className={styles.closeModal}
        role="button"
        tabIndex={0}
        onClick={closeModal}
      />
      <h2 className={styles.title}>Resource Code</h2>
      <p className={styles.body}>Show this QR code to your client so that they may open this page on their phone.</p>
      <QRCodeSVG value={window.location.href} size={235} />
      <div>
        <Button
          children="CLOSE"
          onClick={closeModal}
          addClass={styles.closeBtn}
          tabIndex={0}
        />
      </div>
    </Modal>
  );
};

export default QrCodeModal;