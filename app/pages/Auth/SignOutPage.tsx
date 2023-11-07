import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { WebAuth } from "auth0-js";
import { useAppContext, AuthService } from "../../utils";

export const SignOutPage = () => {
  const context = useAppContext();
  const { setAuthState } = context;
  const webAuth = context.webAuth as WebAuth;

  useEffect(() => {
    AuthService.logout(
      webAuth,
      "UcnuRrX6S0SeDEhW9PRe01wEhcvIRuwc",
      setAuthState
    );
  });

  return <Redirect to="/" />;
};
