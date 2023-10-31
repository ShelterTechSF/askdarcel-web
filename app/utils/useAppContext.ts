import { createContext, useContext } from "react";
import { WebAuth } from "auth0-js";
import { GeoCoordinates } from "./location";

export const AppContext = createContext({
  userLocation: <GeoCoordinates | null>null,
  authState: {
    isAuthenticated: false,
    user: {
      id: "",
      email: "",
    },
    accessTokenObject: {
      expiresAt: new Date(1970, 0, 1),
      token: "",
    }
  },
  setAuthState: <(state: any) => void><unknown>null,
  webAuth: <WebAuth | null>null,
});

export const useAppContext = () => useContext(AppContext);
