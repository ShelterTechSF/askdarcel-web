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
    accessToken: ""
  },
  setAuthState: <(state: any) => void><unknown>null,
  webAuth: <WebAuth | null>null,
});

export const useAppContext = () => useContext(AppContext);
