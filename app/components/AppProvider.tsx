import React, { useState, useMemo, useEffect } from "react";
import auth0 from "auth0-js";

import { AppContext, GeoCoordinates } from "utils";
import SessionCacher from "utils/SessionCacher";

export const AppProvider = ({
  children,
  userLocation,
}: {
  children: React.ReactNode;
  userLocation: GeoCoordinates | null;
}) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: {
      id: "",
      email: "",
    },
    accessToken: "",
  });

  useEffect(() => {
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

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
