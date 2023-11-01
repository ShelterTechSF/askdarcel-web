import type { WebAuth, Auth0Result } from "auth0-js";
import { defaultAuthObject } from "components/AppProvider";

export default class AuthService {
  static calculateExpirationTime(secondsUntilExpiration: number) {
    const currentTime = new Date();
    const expirationTime = new Date(currentTime.getTime() + secondsUntilExpiration * 1000);
    console.log(expirationTime);
    return expirationTime;
  }

  static persistUser(hash: string, webAuth: WebAuth, setAuthState: any) {
    webAuth.parseHash({ hash }, (err, authResult) => {
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
            expiresAt: expiresIn ? this.calculateExpirationTime(expiresIn) : null,
          }
        };

        setAuthState(authObject);
      }
    });
  }

  static passwordlessStart = (
    evt: React.SyntheticEvent,
    webAuth: WebAuth,
    email: string,
    callback?: () => void
  ) => {
    evt.preventDefault();
    webAuth.passwordlessStart(
      {
        connection: "email",
        send: "code",
        email,
      },
      (err) => {
        if (err) {
          // TODO: Handle errors
          return;
        }

        if (callback) {
          callback();
        }
      }
    );
  };

  static passwordlessVerify = (webAuth: WebAuth, email: string, verificationCode: string) => {
    webAuth.passwordlessLogin(
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

  static logout = (webAuth: WebAuth, clientId: string, setAuthState) => {
    // Resets authState which in turn triggers an effect that clears sessionStorage
    setAuthState(defaultAuthObject);

    webAuth.logout({
      returnTo: 'http://localhost:8080',
      clientID: clientId
    });
  };

  static tokenExpired = (tokenExpiration: Date) => {
    return tokenExpiration && (new Date(tokenExpiration) < new Date());
  }

  static refreshAuthToken = (webAuth: WebAuth) => {
    return new Promise((resolve, reject) => {
      webAuth.checkSession({}, (err, authResult: Auth0Result) => {
        if (err) {
          reject(err);
        } else {
          resolve(authResult);
        }
      })
    });
  }

}
