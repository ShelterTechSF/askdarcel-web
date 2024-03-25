import React, {
  useState,
  useMemo,
  useEffect,
  createContext,
  useContext,
} from "react";
import auth0, { Auth0Result, WebAuth } from "auth0-js";
import * as Sentry from "@sentry/browser";
import * as SessionCacher from "utils/SessionCacher";
import * as AuthService from "utils/AuthService";
import { GeoCoordinates } from "utils";
import config from "../config";

export interface UserSignUpData {
  email: string;
  name: string;
  organization: string | null;
}

export type AuthState = {
  user: {
    id: string;
    email: string;
  };
  accessTokenObject: {
    expiresAt: Date;
    token: string;
  };
} | null;

interface Context {
  userLocation: GeoCoordinates | null;
  authState: AuthState;
  setAuthState: (state: AuthState) => void;
  authClient: WebAuth;
}

const authClient = new auth0.WebAuth({
  audience: config.AUTH0_AUDIENCE,
  clientID: config.AUTH0_CLIENT_ID,
  domain: config.AUTH0_DOMAIN,
  redirectUri: config.AUTH0_REDIRECT_URI,
  responseType: "token id_token",
});

export const AppContext = createContext<Context>({
  userLocation: null,
  authState: null,
  setAuthState: () => {},
  authClient,
});

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({
  children,
  userLocation,
}: {
  children: React.ReactNode;
  userLocation: GeoCoordinates | null;
}) => {
  const authObject = SessionCacher.getAuthObject();
  const [authState, setAuthState] = useState<AuthState>(authObject);

  // We have to use useMemo here to manage the contextValue to ensure that the user's authState
  // propagates downward after authentication. I couldn't find a way to get this to work with
  // useState. Moreover, we can't use a simple object to define contextValue, as the object would
  // be recreated at each render and thus force all of its child components to re-render as well.
  const contextValue = useMemo(() => {
    return {
      userLocation,
      authState,
      setAuthState,
      authClient,
    };
  }, [authState, userLocation]);

  useEffect(() => {
    // This effect runs after any changes to the AppContext's authState and syncs the changes
    // to the authObject in sessionStorage.
    SessionCacher.setAuthObject(authState);

    // If the SessionCacher has userSignUpData object, that means a user has just been created
    // in Auth0 and a redirect has occurred. Therefore, we save the new user data to our database.
    // The authState must also have propagated or else we won't have the token yet.
    const newUserData = SessionCacher.getUserSignUpData();
    if (newUserData && authState) {
      SessionCacher.clearUserSignUpData();
      AuthService.saveUser(
        newUserData,
        authState.user.id,
        authState.accessTokenObject.token
      );
    }
  }, [authState]);

  if (
    authObject &&
    AuthService.hasAccessTokenExpired(
      new Date(authObject.accessTokenObject.expiresAt)
    )
  ) {
    AuthService.refreshAccessToken(contextValue.authClient)
      .then((authResult: Auth0Result) => {
        if (
          authState &&
          authResult.accessToken &&
          authResult.expiresIn !== undefined
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
