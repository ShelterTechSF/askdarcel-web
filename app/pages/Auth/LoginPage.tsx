import React, { useState } from "react";
import { Link } from "react-router-dom";
import { WebAuth } from "auth0-js";
import { Button } from "components/ui/inline/Button/Button";
import { useAppContext, AuthService } from "utils";

import { VerificationModal } from "./VerificationModal";

import styles from "./Auth.module.scss";

export const LoginPage = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const authClient = useAppContext().authClient as WebAuth;
  const { passwordlessStart, passwordlessVerify } = AuthService;

  const logIn = (evt: React.SyntheticEvent) => {
    evt.preventDefault();
    passwordlessStart(authClient, email).then(() => {
      setModalIsOpen(true);
    });
  };

  return (
    <div className={styles.authPage}>
      <h1 className={styles.title}>For Case Managers</h1>
      <Link to="/sign-up">New here? Sign up!</Link>
      <p>
        We want to make sure that your account information is safe, so you will
        be sent a verification code to your email each time you log in. Please
        enter in your email address and then check your email to find a 6 digit
        verification code.
      </p>
      <form className={styles.authForm} onSubmit={logIn}>
        <input
          type="text"
          name="email"
          placeholder="Email address"
          value={email}
          onChange={(evt) => {
            setEmail(evt.target.value);
          }}
        />
        <Button addClass={styles.authFormButton} buttonType="submit">
          Sign In
        </Button>
      </form>

      <VerificationModal
        email={email}
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        verifyCode={(code) => passwordlessVerify(authClient, email, code)}
        resendCode={() => passwordlessStart(authClient, email)}
        buttonText="Log in"
      />
    </div>
  );
};
