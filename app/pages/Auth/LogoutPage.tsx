import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { WebAuth } from "auth0-js";
import * as AuthService from "utils/AuthService";
import { useAppContext } from "../../utils";

import Config from "../../config";

export const LogoutPage = () => {
  const context = useAppContext();
  const { setAuthState } = context;
  const authClient = context.authClient as WebAuth;

  useEffect(() => {
    AuthService.logout(authClient, Config.AUTH0_CLIENT_ID, setAuthState);
  });

  return <Redirect to="/" />;
};
