import React, { useState } from "react";
import * as Sentry from "@sentry/browser";
import { Link } from "react-router-dom";
import { Button } from "components/ui/inline/Button/Button";
import * as AuthService from "utils/AuthService";
import { useAppContext } from "utils";

import { VerificationModal } from "./VerificationModal";

import styles from "./Auth.module.scss";

export const SignUpPage = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const { authClient } = useAppContext();
  const { passwordlessStart, completeUserSignup } = AuthService;

  const signUp = (evt: React.SyntheticEvent) => {
    evt.preventDefault();
    passwordlessStart(authClient, email).then(
      () => {
        setModalIsOpen(true);
      },
      (error) => {
        if (error) {
          // TODO: Inform user of the error?
          Sentry.captureException(error);
        }
      }
    );
  };

  return (
    <div className={styles.authPage}>
      <h1 className={styles.title}>For Case Managers</h1>
      <Link to="/log-in">Already have an account? Log in!</Link>
      <form className={styles.authForm} onSubmit={signUp}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={name}
          onChange={(evt) => {
            setName(evt.target.value);
          }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={email}
          onChange={(evt) => {
            setEmail(evt.target.value);
          }}
        />
        <input
          type="text"
          name="organization"
          placeholder="Organization (optional)"
          value={organization}
          onChange={(evt) => {
            setOrganization(evt.target.value);
          }}
        />
        <Button addClass={styles.authFormButton} buttonType="submit">
          Send Verification Code
        </Button>
      </form>

      <VerificationModal
        email={email}
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        verifyCode={(code) =>
          completeUserSignup(authClient, code, email, name, organization)
        }
        resendCode={() => passwordlessStart(authClient, email)}
        buttonText="Sign up"
      />
    </div>
  );
};
