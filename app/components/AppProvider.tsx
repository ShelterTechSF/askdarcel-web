import React, { useState, useMemo, useEffect } from "react";
import auth0, { Auth0Result } from "auth0-js";

import { AppContext, GeoCoordinates, SessionCacher, AuthService } from "utils";
import AuthObject from "utils/SessionCacher";

export const defaultAuthObject: AuthObject = {
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
    // This ensures that the sessionStorage authObject is synced to the AppContext's authState
    SessionCacher.setAuthObject(authState);
  }, [authState]);

  const contextValue = useMemo(() => {
    const webAuth = new auth0.WebAuth({
      audience: "http://localhost:8080/api",
      clientID: "UcnuRrX6S0SeDEhW9PRe01wEhcvIRuwc",
      domain: "dev-nykixf8szsm220fi.us.auth0.com",
      redirectUri: "http://localhost:8080",
      responseType: "token id_token",
    });

    return {
      userLocation,
      authState,
      setAuthState,
      webAuth,
    };
  }, [authState, userLocation]);

  if (
    authObject.isAuthenticated && authObject.accessTokenObject.expiresAt &&
    AuthService.tokenExpired(new Date(authObject.accessTokenObject.expiresAt))
  ) {
    AuthService.refreshAuthToken(contextValue.webAuth)
      .then((result: unknown) => {
        const authResult = result as Auth0Result;
        if (authResult.accessToken && typeof authResult.expiresIn !== "undefined") {
          setAuthState({
            ...authState,
            accessTokenObject: {
              token: authResult.accessToken,
              expiresAt: AuthService.calculateExpirationTime(
                authResult.expiresIn
              ),
            },
          });
        } else {
          throw new Error("Unexpected result format");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
