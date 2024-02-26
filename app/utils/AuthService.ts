import type { WebAuth, Auth0Result } from "auth0-js";
import { defaultAuthObject } from "components/AppProvider";
import { post } from "utils/DataService";
import { SessionCacher } from "utils";
import type { AuthState, UserSignUpData } from "components/AppProvider";
import config from "../config";

/*
  This class provides a set of methods that serve as an interface between our application
  and the Auth0 servers where the user's auth state and data is stored.
*/

export default class AuthService {
  static calculateSessionExpiration(secondsUntilExpiration: number) {
    const currentTime = new Date();
    const expirationTime = new Date(
      currentTime.getTime() + secondsUntilExpiration * 1000
    );

    return expirationTime;
  }

  static initializeUserSession(
    hash: string,
    authClient: WebAuth,
    setAuthState: any
  ) {
    authClient.parseHash({ hash }, (err, authResult) => {
      if (err) {
        // TODO: Handle errors
      }

      if (authResult?.accessToken) {
        const { accessToken, expiresIn, idTokenPayload } = authResult;
        const authObject = {
          isAuthenticated: true,
          user: {
            email: idTokenPayload.email,
            id: idTokenPayload.sub,
          },
          accessTokenObject: {
            token: accessToken,
            expiresAt: expiresIn
              ? this.calculateSessionExpiration(expiresIn)
              : null,
          },
        };

        setAuthState(authObject);
      }
    });
  }

  // Invokes the passwordlessLogin method and following that stores the new user data in sessionStorage
  static completeUserSignup = (
    authClient: WebAuth,
    verificationCode: string,
    email: string,
    name: string,
    organization: string | null = null
  ) => {
    this.passwordlessLogin(authClient, email, verificationCode);
    // Store user sign up data, which will be saved to our backend after Auth0 success redirect
    SessionCacher.setUserSignUpData({ email, name, organization });
  };

  // This method initiates the log-in/sign-up process by sending a code
  // to the user's inbox.
  static passwordlessStart = (authClient: WebAuth, email: string) => {
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

  // This method passes the user's verification code to Auth0's server, which
  // completes their sign-up/log-in action
  static passwordlessLogin = (
    authClient: WebAuth,
    email: string,
    verificationCode: string
  ) => {
    authClient.passwordlessLogin(
      {
        connection: "email",
        email,
        verificationCode,
      },
      (err) => {
        if (err) {
          // TODO: Handle errors
        }
      }
    );
  };

  static logout = (
    authClient: WebAuth,
    clientId: string,
    setAuthState: (state: AuthState) => void
  ) => {
    setAuthState(defaultAuthObject);

    authClient.logout({
      returnTo: config.AUTH0_REDIRECT_URI,
      clientID: clientId,
    });
  };

  static hasAccessTokenExpired = (tokenExpiration: Date) => {
    return !tokenExpiration || new Date(tokenExpiration) < new Date();
  };

  static refreshAccessToken = (authClient: WebAuth) => {
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

  static saveUser = (
    userSignUpData: UserSignUpData,
    userExternalId: string,
    authToken: string
  ) => {
    return new Promise((resolve, reject) => {
      const response = post(
        "/api/users",
        { ...userSignUpData, user_external_id: userExternalId },
        { Authorization: `Bearer ${authToken}` }
      );
      response.then(
        (result) => {
          resolve(result);
        },
        (error) => {
          reject(error);
        }
      );
    });
  };
}
