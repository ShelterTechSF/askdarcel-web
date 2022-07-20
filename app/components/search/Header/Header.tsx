import React, { useState } from 'react';

import Button from 'components/ui/inline/Button';
import { icon as assetIcon } from 'assets';
import QrCodeModal from 'components/ui/QrCodeModal/QrCodeModal';

import styles from './Header.module.scss';

const Header = ({
  resultsTitle,
  expandList,
  setExpandList,
}: {
  resultsTitle: string;
  expandList: boolean;
  setExpandList: (_expandList: boolean) => void;
}) => {
  const [qrCodeModalOpen, setQrCodeModalOpen] = useState(false);

  const toggleQrCodeModal = () => {
    setQrCodeModalOpen(!qrCodeModalOpen);
  };

  return (
    <div className={styles.header}>
      <h1 className={styles.title}>{resultsTitle}</h1>
      <Button
        onClick={toggleQrCodeModal}
        addClass={styles.qrCodeBtn}
        styleType="transparent"
      >
        <>
          <img src={assetIcon('qr-code')} alt="QR Code" className={styles.qrCodeIcon} />
          <span className={styles.qrCodeBtnText}>Resource List QR Code</span>
        </>
      </Button>
      <QrCodeModal
        isOpen={qrCodeModalOpen}
        setIsOpen={setQrCodeModalOpen}
      />
      <div className={styles.mapListToggleContainer}>
        <button type="button" className={styles.mapListToggleBtn} onClick={() => setExpandList(true)}>
          <span className={`${styles.listIcon} ${expandList ? styles.activeView : ''}`} />
        </button>
        <button type="button" className={styles.mapListToggleBtn} onClick={() => setExpandList(false)}>
          <span className={`${styles.mapIcon} ${!expandList ? styles.activeView : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default Header;
