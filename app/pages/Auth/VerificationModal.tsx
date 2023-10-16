import React, { useState, createRef } from "react";
import { Modal } from "components/ui/Modal/Modal";
import { Button } from "components/ui/inline/Button/Button";

import styles from "./Auth.module.scss";

export const VerificationModal = ({
  verifyCode,
  modalIsOpen,
  setModalIsOpen,
}: {
  verifyCode: (code: string) => void;
  modalIsOpen: boolean;
  setModalIsOpen: (isOpen: boolean) => void;
}) => {
  const initialVerificationCode = ["", "", "", "", "", ""];
  const [verificationCode, setVerificationCode] = useState(
    initialVerificationCode
  );
  const inputRefs: React.RefObject<HTMLInputElement>[] =
    initialVerificationCode.map(() => createRef());

  const handleVerificationCodeChange = (index: number, value: string) => {
    const updatedVerificationCode = [...verificationCode];
    updatedVerificationCode[index] = value;
    setVerificationCode(updatedVerificationCode);

    const nextRef = inputRefs[index + 1];
    if (value && nextRef && nextRef.current) {
      nextRef.current.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const clipboardData = event.clipboardData || window.Clipboard;
    const pastedData = clipboardData.getData("text");

    if (pastedData.length === 6) {
      const pastedCodeArray = pastedData.split("");
      const updatedVerificationCode = [...verificationCode];

      pastedCodeArray.forEach((digit, index) => {
        const inputRef = inputRefs[index];
        if (inputRef.current) {
          updatedVerificationCode[index] = digit;
          inputRef.current.value = digit;
        }
      });

      setVerificationCode(updatedVerificationCode);
      inputRefs?.[0]?.current?.focus();
    }
  };

  const onSubmitCode = () => {
    const codeString = verificationCode.join("");
    verifyCode(codeString);
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      addModalClass={styles.clinicianActions}
      closeModal={() => setModalIsOpen(false)}
    >
      <div className={styles.modalContent}>
        <h2 className={styles.title}>Please check your email</h2>
        <div className={styles.verificationDigits}>
          {verificationCode.map((digit, index) => (
            <input
              // Array total index is static; thus it's okay to disable no-array-index-key:
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              type="text"
              value={digit}
              onChange={(evt) =>
                handleVerificationCodeChange(index, evt.target.value ?? "")
              }
              onPaste={handlePaste}
              ref={inputRefs[index]}
              maxLength={1}
            />
          ))}
        </div>
        <Button onClick={onSubmitCode}>Verify Account</Button>
      </div>
    </Modal>
  );
};
