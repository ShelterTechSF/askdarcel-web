/**
 * This is the interstial redirect page after a user is authenticated via Auth0.
 * The useEffect hook contains logic that checks the url for a hash, which contains an encoded
 * access token. The code then intializes the user session using by decoding the token and
 * passing the user props to the AppContext authState
 *
 */

import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import * as AuthService from "utils/AuthService";
import { useAppContext } from "utils";
import { Loader } from "components/ui";

export const AuthInterstitial = () => {
  const { authClient, setAuthState } = useAppContext();
  const history = useHistory();

  useEffect(() => {
    const { hash } = window.location;
    if (!hash || !hash.includes("access_token")) {
      return;
    }

    AuthService.initializeUserSession(
      window.location.hash,
      authClient,
      setAuthState
    ).then(() => {
      history.push("navigator-dashboard");
    });
  }, [history, setAuthState, authClient]);

  return (
    <div>
      <Loader />
      Preparing your dashboard...
    </div>
  );
};
