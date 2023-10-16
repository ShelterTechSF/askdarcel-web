/*
  Auth0's passwordlessAPI is the same for signing up and is it for signing in. As such,
  we can share this component across the two pages
*/

import React, { useState } from "react";
import auth0 from "auth0-js";
import { VerificationModal } from "./VerificationModal";

import styles from "./Auth.module.scss";

type Mode = "signIn" | "signUp";

export const PasswordlessAuthentication = ({ mode }: { mode: Mode }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [email, setEmail] = useState("");

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
      <h1>For Case Managers</h1>
      <a href={`${mode === "signIn" ? "/sign-up" : "sign-in"}`}>
        {`${
          mode === "signIn"
            ? "New here? Sign up!"
            : "Already have an account? Log in!"
        }`}
      </a>
      <VerificationModal
        verifyCode={verifyCode}
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
      />
      <form className={styles.content} onSubmit={startPasswordlessAuth}>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(evt) => {
            setEmail(evt.target.value);
          }}
        />
        <button type="submit">Send Verification Code</button>
      </form>
    </div>
  );
};
