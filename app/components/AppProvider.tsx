import React, { useState, useMemo, useEffect } from "react";
import auth0, { Auth0Result } from "auth0-js";
import * as Sentry from "@sentry/browser";
import { AppContext, GeoCoordinates, SessionCacher, AuthService } from "utils";
import config from "../config";

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
  };
  accessTokenObject: {
    token: string;
    expiresAt: Date;
  };
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
    AuthService.hasAccessTokenExpired(new Date(authObject.accessTokenObject.expiresAt))
  ) {
    AuthService.refreshAccessToken(contextValue.authClient)
      .then((result: unknown) => {
        const authResult = result as Auth0Result;
        if (
          authResult.accessToken &&
          typeof authResult.expiresIn !== "undefined"
        ) {
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
          throw new Error("Token does not exist or is in unexpected token");
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
