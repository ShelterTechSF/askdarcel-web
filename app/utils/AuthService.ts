import type { WebAuth, Auth0Result } from "auth0-js";
import * as Sentry from "@sentry/browser";
import { post } from "utils/DataService";
import { AuthState, UserSignUpData, setUserSignUpData } from "utils";

/**
  This file provides a set of methods that serve as an interface between our application
  and the Auth0 servers where the user's auth state and data is stored.
*/
export const calculateSessionExpiration = (secondsUntilExpiration: number) => {
  const currentTime = new Date();
  const expirationTime = new Date(
    currentTime.getTime() + secondsUntilExpiration * 1000
  );

  return expirationTime;
};

export const initializeUserSession = (
  hash: string,
  authClient: WebAuth,
  setAuthState: (a: AuthState) => void
) => {
  const promise = new Promise((resolve, reject) => {
    // eslint-disable-next-line no-console
    console.log("executing init session function");
    // eslint-disable-next-line no-console
    console.log("cookies exist? ", document.cookie);
    const stateToken = sessionStorage.getItem("authStateToken") ?? "";
    authClient.parseHash({ hash, state: stateToken }, (err, authResult) => {
      sessionStorage.removeItem("authStateToken");

      if (err) {
        // eslint-disable-next-line no-console
        console.log("error initializing session: ", err);
        Sentry.captureException(err);
        reject(err);
      }

      if (authResult?.accessToken) {
        const { accessToken, expiresIn, idTokenPayload } = authResult;
        const authObject = {
          user: {
            email: idTokenPayload.email,
            id: idTokenPayload.sub,
          },
          accessTokenObject: {
            token: accessToken,
            expiresAt: expiresIn
              ? calculateSessionExpiration(expiresIn)
              : new Date(1970, 1, 1),
          },
        };

        setAuthState(authObject);
        resolve(true);
      }
    });
  });

  return promise;
};

// Invokes the passwordlessLogin method and following that stores the new user data in sessionStorage
export const completeUserSignup = (
  authClient: WebAuth,
  verificationCode: string,
  email: string,
  name: string,
  organization: string | null = null
) => {
  passwordlessLogin(authClient, email, verificationCode);
  // Store user sign up data, which will be saved to our backend after Auth0 success redirect
  setUserSignUpData({ email, name, organization });
};

/** This method initiates the log-in/sign-up process by sending a code
    to the user's inbox.
*/
export const passwordlessStart = (authClient: WebAuth, email: string) => {
  return new Promise((resolve, reject) => {
    authClient.passwordlessStart(
      {
        connection: "email",
        send: "code",
        email,
      },
      (err) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(true);
      }
    );
  });
};

/** This method passes the user's verification code to Auth0's server, which
    completes their sign-up/log-in action. Upon success, the Auth0 library
    will initiate a redirect, which is why this function doesn't have a
    meaningful return value.
*/
export const passwordlessLogin = (
  authClient: WebAuth,
  email: string,
  verificationCode: string
) => {
  const stateToken = createStateToken();
  sessionStorage.setItem("authStateToken", stateToken);
  authClient.passwordlessLogin(
    {
      connection: "email",
      email,
      verificationCode,
      state: stateToken,
    },
    (err) => {
      if (err) {
        // TODO: Inform user of the error?
        Sentry.captureException(err);
      }
    }
  );
};

export const logout = (
  authClient: WebAuth,
  clientId: string,
  setAuthState: (state: AuthState) => void
) => {
  setAuthState(null);
  authClient.logout({
    clientID: clientId,
  });
};

export const hasAccessTokenExpired = (tokenExpiration: Date) => {
  return !tokenExpiration || tokenExpiration < new Date();
};

export const refreshAccessToken = (
  authClient: WebAuth
): Promise<Auth0Result> => {
  return new Promise((resolve, reject) => {
    authClient.checkSession({}, (err, authResult: Auth0Result) => {
      if (err) {
        reject(err);
      } else {
        resolve(authResult);
      }
    });
  });
};

export const saveUser = (
  userSignUpData: UserSignUpData,
  userExternalId: string,
  authToken: string
) => {
  return post(
    "/api/users",
    { ...userSignUpData, user_external_id: userExternalId },
    { Authorization: `Bearer ${authToken}` }
  );
};

// Borrowed from Auth0's randomString function in random.js in the auth0-js package
const createStateToken = () => {
  const bytes = new Uint8Array(32);
  const result = [];
  const charset =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._~";

  const cryptoObj = window.crypto;
  if (!cryptoObj) {
    return "";
  }

  const random = cryptoObj.getRandomValues(bytes);

  for (let a = 0; a < random.length; a += 1) {
    result.push(charset[random[a] % charset.length]);
  }

  return result.join("");
};
