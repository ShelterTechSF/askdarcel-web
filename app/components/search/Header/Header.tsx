import React, { useState } from "react";

import { icon as assetIcon } from "assets";
import { Button } from "components/ui/inline/Button/Button";
import { QrCodeModal } from "components/ui/QrCodeModal/QrCodeModal";
import whiteLabel from "utils/whitelabel";

import styles from "./Header.module.scss";

const { showHeaderQrCode, showPrintResultsBtn } = whiteLabel;

export const Header = ({
  resultsTitle,
  translateResultsTitle = true,
  expandList,
  setExpandList,
}: {
  resultsTitle: string;
  translateResultsTitle?: boolean;
  expandList: boolean;
  setExpandList: (_expandList: boolean) => void;
}) => {
  const [qrCodeModalOpen, setQrCodeModalOpen] = useState(false);

  return (
    <div className={styles.header}>
      <h1
        className={`${styles.title} ${
          translateResultsTitle ? "" : "notranslate"
        }`}
      >
        {resultsTitle}
      </h1>
      <Button
        onClick={() => {
          setQrCodeModalOpen(true);
        }}
        addClass={`${styles.qrCodeBtn} ${
          showHeaderQrCode ? styles.showBtn : ""
        }`}
        styleType="transparent"
      >
        <>
          <img src={assetIcon("qr-code")} alt="QR code icon" />
          <span className={styles.btnText}>Resource List QR Code</span>
        </>
      </Button>
      <Button
        iconName="fas fa-print"
        iconVariant="before"
        variant="secondary"
        size="lg"
        onClick={() => {
          window.print();
        }}
        addClass={`${styles.printAllBtn} ${
          showPrintResultsBtn ? styles.showBtn : ""
        }`}
      >
        Print all results
      </Button>
      <QrCodeModal isOpen={qrCodeModalOpen} setIsOpen={setQrCodeModalOpen} />
      <div className={styles.mapListToggleContainer}>
        <button
          type="button"
          className={styles.mapListToggleBtn}
          onClick={() => setExpandList(true)}
        >
          <span
            className={`${styles.listIcon} ${
              expandList ? styles.activeView : ""
            }`}
          />
        </button>
        <button
          type="button"
          className={styles.mapListToggleBtn}
          onClick={() => setExpandList(false)}
        >
          <span
            className={`${styles.mapIcon} ${
              !expandList ? styles.activeView : ""
            }`}
          />
        </button>
      </div>
    </div>
  );
};
