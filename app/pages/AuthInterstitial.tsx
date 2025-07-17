/**
 * This is the interstial redirect page after a user is authenticated via Auth0.
 * The useEffect hook contains logic that checks the url for a hash, which contains an encoded
 * access token. The code then intializes the user session by decoding the token and passing
 * the user props to the AppContext authState.
 *
 */

import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import * as Sentry from "@sentry/browser";

import * as AuthService from "utils/AuthService";
import { useAppContext } from "utils";
import { Loader } from "components/ui";

export const AuthInterstitial = () => {
  const { authClient, authState, setAuthState } = useAppContext();
  const history = useHistory();

  useEffect(() => {
    const { hash } = window.location;
    // Check if the authState already exists and if so, redirect the user to the nav dashboard. We also
    // want to prevent the initUserSession method from being called twice as that can break the auth flow
    // and/or lead to other weird consequences
    if (authState) {
      history.push("/");
      return;
    }
    if (!hash || !hash.includes("access_token")) {
      // If auth state does NOT exist BUT there is no hash or the hash has no access token, something went off somehow.
      // Just default to redirecting the user to the log-in page until we can craft a more sophisticated way to handle this
      history.push("log-in");
      return;
    }

    AuthService.initializeUserSession(
      window.location.hash,
      authClient,
      setAuthState
    )
      .then(() => {
        history.push("/");
      })
      .catch((err) => {
        // Something went awry. Log the error and redirect the user back to the log-in page until we can better handle this case.
        // Better luck next time (for now)!
        // TODO: handle this case
        Sentry.captureException(err);
        history.push("log-in");
      });
  }, [authClient, authState, history, setAuthState]);

  return (
    <div>
      <Loader />
      Preparing your dashboard...
    </div>
  );
};
