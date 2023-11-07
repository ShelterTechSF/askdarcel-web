import React, { useState } from "react";
import { WebAuth } from "auth0-js";
import { Link } from "react-router-dom";
import { Button } from "components/ui/inline/Button/Button";
import { useAppContext, AuthService } from "utils";

import { VerificationModal } from "./VerificationModal";

import styles from "./Auth.module.scss";

export const SignUpPage = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const webAuth = useAppContext().webAuth as WebAuth;
  const { passwordlessStart, passwordlessVerify } = AuthService;

  const signUp = (evt: React.SyntheticEvent) => {
    evt.preventDefault();
    /* Todo: We will need to:
      a) save the user's name/org to our database
      b) check if the user email already exists and display an error message if so
    */
    passwordlessStart(webAuth, email).then(() => {
      setModalIsOpen(true);
    });
  };

  return (
    <div className={styles.authPage}>
      <h1 className={styles.title}>For Case Managers</h1>
      <Link to="/sign-in">Already have an account? Log in!</Link>
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
          type="text"
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
        verifyCode={(code) => passwordlessVerify(webAuth, email, code)}
        resendCode={() => passwordlessStart(webAuth, email)}
        buttonText="Sign up"
      />
    </div>
  );
};
