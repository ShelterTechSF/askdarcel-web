/**
 * This is the interstial redirect page after a user is authenticated via Auth0.
 * The useEffect hook contains logic that checks the url for a hash, which contains an encoded
 * access token. The code then intializes the user session by decoding the token and passing
 * the user props to the AppContext authState.
 *
 */

import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import * as AuthService from "utils/AuthService";
import { useAppContext } from "utils";
import { Loader } from "components/ui";

export const AuthInterstitial = () => {
  const { authClient, authState, setAuthState } = useAppContext();
  const history = useHistory();

  useEffect(() => {
    const { hash } = window.location;
    // In some cases the effect can run twice, the second time happening after the user authState
    // has been successfully created. If `initializeUserSession` is run after a session already exists
    // it causes an unhandled rejection, which breaks the login flow. Thus, we check if the authState
    // already exists and if so, prevent the initUserSession method from being called again.
    if ((authState && !hash) || !hash.includes("access_token")) {
      return;
    }

    AuthService.initializeUserSession(
      window.location.hash,
      authClient,
      setAuthState
    ).then(() => {
      history.push("navigator-dashboard");
    });
  }, [authClient, authState, history, setAuthState]);

  return (
    <div>
      <Loader />
      Preparing your dashboard...
    </div>
  );
};
