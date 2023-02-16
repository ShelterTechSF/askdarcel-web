import React, { ReactNode } from "react";
import ReactModal from "react-modal";

import { icon } from "assets";

import styles from "./Modal.module.scss";
/**
 * This modal component is used on the service/search results page. It provides
 * shared layout and shared styling.
 */

export const Modal = ({
  isOpen,
  closeModal,
  children,
  addModalClass,
}: {
  isOpen: boolean;
  closeModal: () => void;
  children: ReactNode;
  addModalClass?: string;
}) => (
  <ReactModal
    isOpen={isOpen}
    className={`${styles.modal} ${addModalClass}`}
    overlayClassName={styles.modalOverlay}
    onRequestClose={closeModal}
  >
    <div role="button" tabIndex={0} onClick={closeModal}>
      <img src={icon("close")} alt="close" className={styles.closeModalIcon} />
    </div>
    {children}
  </ReactModal>
);
