import type { WebAuth, Auth0Result } from "auth0-js";
import { defaultAuthObject } from "components/AppProvider";
import { post } from "utils/DataService";
import type { AuthState } from "components/AppProvider";

/*
  This class provides a set of methods that serve as an interface between our application
  and the Auth0 servers where the user's state and data is stored.
*/

export default class AuthService {
  static calculateSessionExpiration(secondsUntilExpiration: number) {
    const currentTime = new Date();
    const expirationTime = new Date(
      currentTime.getTime() + secondsUntilExpiration * 1000
    );

    return expirationTime;
  }

  static persistUser(hash: string, authClient: WebAuth, setAuthState: any) {
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

  static initializeUserSignUp = (authClient: WebAuth, email: string) => {
    return new Promise((resolve, reject) => {
      this.userExists(email).then((exists) => {
        if (exists) {
          reject(new Error('userExists'));
        } else {
          this.passwordlessStart(authClient, email).then((result) => {
            resolve(result);
          })
        }
      });
    });
  };

  // Invokes the passwordlessLogin method and following that saves the user to our database
  static completeUserSignup = (authClient: WebAuth,
    verificationCode: string,
    email: string,
    name: string,
    organization: (string | null) = null) => {
      this.passwordlessLogin(authClient, email, verificationCode);
      // We need to optimistically save the user to our database here. The user is saved to the _Auth0_
      // database after the passwordlessLogin method succeeds. We also want to save user data in our
      // backend. This should be done after a success callback after passwordlessLogin succceds; however,
      // the passwordlessLogin success callback does not fire within our app, because, upon success, Auth0
      // triggers a redirect to our home page. At that point, we do not have the user's name or organization,
      // which we need to save in our database. Thus, we save the user here.
      //
      // If for some reason, the passwordlessLogin method errors, this code still save the user in our DB.
      // At that point, the worst case scenario is that the user will be informed that they have already
      // signed up if they try to sign up again and to log in instead. Since the Auth0 passwordless flow
      // does not have a sign-up process separate from its log-in process, and thus the user will still
      // be created within Auth0 upon going through our site's log-in flow.
      this.saveUser(email, name, organization);
  };

  // This method initiates the sign-in/sign-up process by sending a code
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
      returnTo: "http://localhost:8080",
      clientID: clientId,
    });
  };

  static hasAccessTokenExpired = (tokenExpiration: Date) => {
    return !tokenExpiration || (new Date(tokenExpiration) < new Date());
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

  static userExists = (email: string) => {
    return new Promise((resolve, reject) => {
      post('/api/users/user_exists', {
        email
      }).then((resp) => {
        resp.json().then(result => resolve(result.user_exists));
      }, (error) => {
        reject(error);
      })
    });
  }

  static saveUser = (email: string, name: string, organization: (string | null) = null) => {
    return new Promise((resolve, reject) => {
      const response = post('/api/users', {
        email,
        name,
        organization,
      });
      response.then((result) => {
        resolve(result);
      }, (error) => {
        reject(error);
      })
    });
  }
}
