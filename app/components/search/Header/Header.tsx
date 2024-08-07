import React, { useState } from "react";

import whiteLabel from "utils/whitelabel";
import { Button } from "components/ui/inline/Button/Button";
import { icon as assetIcon } from "assets";
import { QrCodeModal } from "components/ui/QrCodeModal/QrCodeModal";

import styles from "./Header.module.scss";

const { showHeaderQrCode, showPrintResultsBtn } = whiteLabel;

export const Header = ({
  resultsTitle,
  translateResultsTitle = true,
  expandList,
  setExpandList,
  searchSaved,
  saveSearch,
}: {
  resultsTitle: string;
  translateResultsTitle?: boolean;
  expandList: boolean;
  setExpandList: (_expandList: boolean) => void;
  searchSaved?: boolean;
  saveSearch?: (() => void) | null;
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
      <div className={styles.headerActions}>
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
        {saveSearch ? (
          <Button
            onClick={saveSearch}
            styleType="transparent"
            disabled={searchSaved}
          >
            {searchSaved ? "Results Saved!" : "Save Results"}
          </Button>
        ) : null}
        <Button
          onClick={() => {
            window.print();
          }}
          addClass={`${styles.printAllBtn} ${
            showPrintResultsBtn ? styles.showBtn : ""
          }`}
          styleType="transparent"
        >
          <>
            <img src={assetIcon("print-blue")} alt="Printer icon" />
            <span className={styles.btnText}>Print all results</span>
          </>
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
    </div>
  );
};
