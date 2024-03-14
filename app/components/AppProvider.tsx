import React, { useState, useMemo, useEffect } from "react";
import auth0, { Auth0Result } from "auth0-js";
import * as Sentry from "@sentry/browser";
import * as SessionCacher from "utils/SessionCacher";
import * as AuthService from "utils/AuthService";
import { AuthState, AppContext, GeoCoordinates } from "utils";
import config from "../config";

export interface UserSignUpData {
  email: string;
  name: string;
  organization: string | null;
}

export const defaultAuthObject: AuthState = {
  isAuthenticated: false,
  user: {
    id: "",
    email: "",
  },
  accessTokenObject: {
    token: "",
    expiresAt: new Date(1970, 0, 1),
  },
};

export const AppProvider = ({
  children,
  userLocation,
}: {
  children: React.ReactNode;
  userLocation: GeoCoordinates | null;
}) => {
  const authObject = SessionCacher.getAuthObject() ?? defaultAuthObject;
  const [authState, setAuthState] = useState(authObject);
  useEffect(() => {
    // This effect runs after any changes to the AppContext's authState and syncs the changes
    // to the authObject in sessionStorage.
    SessionCacher.setAuthObject(authState);

    // If the SessionCacher has userSignUpData object, that means a user has just been created
    // in Auth0 and a redirect has occurred. Therefore, we save the new user data to our database.
    // The authState must also have propagated or else we won't have the token yet; thus the
    // `authState.isAuthenticated` check
    const newUserData = SessionCacher.getUserSignUpData();
    if (newUserData && authState.isAuthenticated) {
      SessionCacher.clearUserSignUpData();
      AuthService.saveUser(
        newUserData,
        authState.user.id,
        authState.accessTokenObject.token
      );
    }
  }, [authState]);

  const contextValue = useMemo(() => {
    const authClient = new auth0.WebAuth({
      audience: config.AUTH0_AUDIENCE,
      clientID: config.AUTH0_CLIENT_ID,
      domain: config.AUTH0_DOMAIN,
      redirectUri: config.AUTH0_REDIRECT_URI,
      responseType: "token id_token",
    });

    return {
      userLocation,
      authState,
      setAuthState,
      authClient,
    };
  }, [authState, userLocation]);

  if (
    authObject.isAuthenticated &&
    authObject.accessTokenObject.expiresAt &&
    AuthService.hasAccessTokenExpired(
      new Date(authObject.accessTokenObject.expiresAt)
    )
  ) {
    AuthService.refreshAccessToken(contextValue.authClient)
      .then((result: Auth0Result) => {
        const authResult = result;
        if (authResult.accessToken && authResult.expiresIn !== undefined) {
          setAuthState({
            ...authState,
            accessTokenObject: {
              token: authResult.accessToken,
              expiresAt: AuthService.calculateSessionExpiration(
                authResult.expiresIn
              ),
            },
          });
        } else {
          throw new Error("Token does not exist or is unexpected token");
        }
      })
      .catch((err) => {
        Sentry.captureException(err);
      });
  }

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
