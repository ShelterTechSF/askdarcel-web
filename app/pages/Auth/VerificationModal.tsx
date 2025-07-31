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
  const [countdown, setCountdown] = useState(60); // 60 second countdown
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  
  const inputRefs: React.RefObject<HTMLInputElement>[] =
    initialVerificationCode.map(() => createRef());

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendDisabled(false);
    }
  }, [countdown]);

  // Reset countdown when modal opens
  useEffect(() => {
    if (modalIsOpen) {
      setCountdown(60);
      setIsResendDisabled(true);
    }
  }, [modalIsOpen]);

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

  const handleResendCode = async () => {
    await resendCode();
    setCountdown(60);
    setIsResendDisabled(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      addModalClass={styles.clinicianActions}
      closeModal={() => setModalIsOpen(false)}
    >
      <div className={styles.modalContent}>
        <h2 className={styles.title}>Please check your email</h2>
        <div className={styles.modalEmailContainer}>
          <p>We&apos;ve sent a code to&nbsp;</p>
          <div className={styles.modalEmail}>{email}</div>
        </div>
        <div className={styles.verificationDigits}>
          {verificationCode.map((digit, index) => (
            <input
              className={styles.verificationDigitsInput}
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
        <div className={styles.verificationModalButtons}>
          <ResendCode 
            resendCode={handleResendCode}
            countdown={countdown}
            isResendDisabled={isResendDisabled}
          />
          <Button onClick={onSubmitCode}>{buttonText}</Button>
        </div>
      </div>
    </Modal>
  );
};

const ResendCode = ({ 
  resendCode, 
  countdown, 
  isResendDisabled 
}: { 
  resendCode: () => Promise<unknown>;
  countdown: number;
  isResendDisabled: boolean;
}) => {
  return (
    <div className={styles.resendCodeContent}>
      <p>Didn&apos;t receive a code? Please check your spam folder.</p>
      <div className={styles.resendCodeContainer}>
        {isResendDisabled ? (
          <div className={styles.countdownText}>
            Resend code in: {formatTime(countdown)}
          </div>
        ) : (
          <Button 
            onClick={resendCode}
            styleType="transparent"
            addClass={styles.resendCodeButton}
          >
            Send another code
          </Button>
        )}
      </div>
    </div>
  );
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
