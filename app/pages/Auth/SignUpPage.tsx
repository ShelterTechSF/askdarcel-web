import React, { useState } from "react";
import auth0 from "auth0-js";
import { Link } from "react-router-dom";
import { Button } from "components/ui/inline/Button/Button";

import { VerificationModal } from "./VerificationModal";

import styles from "./Auth.module.scss";

export const SignUpPage = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");

  const webAuth = new auth0.WebAuth({
    clientID: "UcnuRrX6S0SeDEhW9PRe01wEhcvIRuwc",
    domain: "dev-nykixf8szsm220fi.us.auth0.com",
    redirectUri: "http://localhost:8080",
    responseType: "token id_token",
  });

  const startPasswordlessAuth = (evt: React.SyntheticEvent) => {
    evt.preventDefault();
    webAuth.passwordlessStart(
      {
        connection: "email",
        send: "code",
        email,
      },
      (err) => {
        if (err) {
          console.log(err);
          return;
        }

        setModalIsOpen(true);
      }
    );
  };

  const verifyCode = (verificationCode: string) => {
    webAuth.passwordlessLogin(
      {
        connection: "email",
        email,
        verificationCode,
      },
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );
  };

  return (
    <div className={styles.authPage}>
      <h1 className={styles.title}>For Case Managers</h1>
      <Link to="/sign-in">Already have an account? Log in!</Link>
      <VerificationModal
        verifyCode={verifyCode}
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
      />
      <form className={styles.authForm} onSubmit={startPasswordlessAuth}>
        <label htmlFor="name">
          Name
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={name}
            onChange={(evt) => {
              setName(evt.target.value);
            }}
          />
        </label>

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

        <label htmlFor="organization">
          Organization
          <input
            type="text"
            name="organization"
            placeholder="Organization"
            value={organization}
            onChange={(evt) => {
              setOrganization(evt.target.value);
            }}
          />
        </label>
        <Button addClass={styles.authFormButton} buttonType="submit">
          Send Verification Code
        </Button>
      </form>
    </div>
  );
};
