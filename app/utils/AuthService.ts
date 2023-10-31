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
    webAuth: any,
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
      (err: AuthError) => {
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

  static passwordlessVerify = (webAuth: any, email: string, verificationCode: string) => {
    webAuth.passwordlessLogin(
      {
        connection: "email",
        email,
        verificationCode,
      },
      (err: AuthError) => {
        if (err) {
          // TODO: Handle errors
        }
      }
    );
  };
}

