import { createContext, useContext } from "react";
import { WebAuth } from "auth0-js";
import { GeoCoordinates } from "./location";

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
  };
  accessTokenObject: {
    expiresAt: Date;
    token: string;
  };
}

interface Context {
  userLocation: GeoCoordinates | null;
  authState: AuthState;
  setAuthState: (state: AuthState) => void;
  authClient: WebAuth | null;
}

export const AppContext = createContext<Context>({
  userLocation: null,
  authState: {
    isAuthenticated: false,
    user: {
      id: "",
      email: "",
    },
    accessTokenObject: {
      expiresAt: new Date(1970, 0, 1),
      token: "",
    },
  },
  setAuthState: () => {},
  authClient: null,
});

export const useAppContext = () => useContext(AppContext);
