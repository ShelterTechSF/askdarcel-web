import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "components/ui/inline/Button/Button";
import { useAppContext, AuthService } from "utils";

import { VerificationModal } from "./VerificationModal";

import styles from "./Auth.module.scss";

export const SignInPage = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const { webAuth } = useAppContext();
  const { passwordlessStart, passwordlessVerify } = AuthService;
  const signIn = (evt: React.SyntheticEvent) => {
    evt.preventDefault();
    passwordlessStart(evt, webAuth, email, () => setModalIsOpen(true));
  };

  return (
    <div className={styles.authPage}>
      <h1 className={styles.title}>For Case Managers</h1>
      <Link to="/sign-up">New here? Sign up!</Link>
      <VerificationModal
        verifyCode={(code) => passwordlessVerify(webAuth, email, code)}
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
      />
      <form className={styles.authForm} onSubmit={signIn}>
        <label htmlFor="email">
          Email
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(evt) => {
              setEmail(evt.target.value);
            }}
          />
        </label>
        <Button addClass={styles.authFormButton} buttonType="submit">
          Sign In
        </Button>
      </form>
    </div>
  );
};
