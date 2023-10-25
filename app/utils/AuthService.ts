import type { WebAuth, Auth0Error } from "auth0-js";


// We need to make the error prop on the Auth0Error interface optional and this
// is the only way that I could figure out how to do so w/o making the TS
// compiler complain
type OptionalAuth0Error = {
    [K in keyof Auth0Error]?: Auth0Error[K] | undefined;
};
interface AuthError extends OptionalAuth0Error {}

export default class AuthService {
  private static calculateExpirationTime(secondsUntilExpiration: number) {
    const currentTime = new Date();
    const expirationTime = new Date(currentTime.getTime() + secondsUntilExpiration * 1000);

    return expirationTime;
  }

  static persistUser(hash: string, webAuth: WebAuth, setAuthState: any) {
    webAuth.parseHash({ hash }, (err, authResult) => {
      if (err) {
        console.log(err)
      }

      console.log(authResult);

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
        // return Promise.resolve(null);
      }

      // return Promise.reject(err);
    });
  }

  static passwordlessStart = (
    evt: React.SyntheticEvent,
    email: string,
    webAuth: any,
    callback: () => void
  ) => {
    console.log("calling from here!");
    evt.preventDefault();
    webAuth.passwordlessStart(
      {
        connection: "emaidl",
        send: "code",
        email,
      },
      (err: AuthError) => {
        if (err) {
          console.log(err);
          return;
        }

        callback();
      }
    );
  };

  static passwordlessVerify = (email: string, verificationCode: string, webAuth: any) => {
    webAuth.passwordlessLogin(
      {
        connection: "email",
        email,
        verificationCode,
      },
      (err: AuthError) => {
        if (err) {
          console.log(err);
        }
      }
    );
  };
}

