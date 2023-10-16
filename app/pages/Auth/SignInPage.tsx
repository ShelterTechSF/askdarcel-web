import React, { useState } from "react";
import auth0 from "auth0-js";
import { Link } from "react-router-dom";
import { Button } from "components/ui/inline/Button/Button";
import { useAppContext } from "utils";


import { VerificationModal } from "./VerificationModal";

import styles from "./Auth.module.scss";

export const SignInPage = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  // const { passwordlessStart } = useAppContext();
  const { passwordlessStart } = useAppContext();

  const webAuth = new auth0.WebAuth({
    audience: "http://localhost:8080/api",
    clientID: "UcnuRrX6S0SeDEhW9PRe01wEhcvIRuwc",
    domain: "dev-nykixf8szsm220fi.us.auth0.com",
    redirectUri: "http://localhost:8080",
    responseType: "token id_token",
  });


  // const signIn = (evt: React.SyntheticEvent) => {
  //   evt.preventDefault();
  //   webAuth.passwordlessStart(
  //     {
  //       connection: "email",
  //       send: "code",
  //       email,
  //     },
  //     (err) => {
  //       if (err) {
  //         console.log(err);
  //         return;
  //       }

  //       setModalIsOpen(true);
  //     }
  //   );
  // };

    const signIn = (evt: React.SyntheticEvent) => {
      evt.preventDefault();
      console.log('hi!', passwordlessStart);
      passwordlessStart(evt, email, () => setModalIsOpen(true));
    };

  const loginWithCode = (verificationCode: string) => {
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
      <Link to="/sign-up">New here? Sign up!</Link>
      <VerificationModal
        verifyCode={loginWithCode}
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
