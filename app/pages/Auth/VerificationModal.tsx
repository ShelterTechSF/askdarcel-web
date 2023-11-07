import React, { useState, createRef, useEffect } from "react";
import { Modal } from "components/ui/Modal/Modal";
import { Button } from "components/ui/inline/Button/Button";

import styles from "./Auth.module.scss";

export const VerificationModal = ({
  email,
  verifyCode,
  modalIsOpen,
  setModalIsOpen,
  resendCode,
  buttonText,
}: {
  email: string;
  verifyCode: (code: string) => void;
  modalIsOpen: boolean;
  setModalIsOpen: (isOpen: boolean) => void;
  resendCode: () => Promise<unknown>;
  buttonText: string;
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
        <p>We&apos;ve sent a code to {email}</p>
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
        <ResendCode resendCode={resendCode} />
        <Button onClick={onSubmitCode}>{buttonText}</Button>
      </div>
    </Modal>
  );
};

const ResendCode = ({ resendCode }: { resendCode: () => Promise<unknown> }) => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [codeResent, setCodeResent] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timeLeft === 0) {
        clearInterval(interval);
        resendCode();
        setCodeResent(true);
        return;
      }

      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [resendCode, setTimeLeft, timeLeft]);

  return (
    <div>
      {codeResent ? (
        <p>
          Didn&apos;t receive a code?
          <button type="button" onClick={() => {resendCode()}}>
            Try again
          </button>
        </p>
      ) : (
        <>
          <strong>Resend code in:</strong>
          {timeLeft}
        </>
      )}
    </div>
  );
};
