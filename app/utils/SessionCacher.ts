interface AuthObject {
    isAuthenticated: boolean;
    user: {
        id: string;
        email: string;
    };
    accessTokenObject: {
      token: string;
      expiresAt: Date;
    };
}

export default class SessionCacher {
  static getAuthObject(): AuthObject {
    const object = sessionStorage.getItem('authObject');
    return object ? JSON.parse(object) : null;
  }

  static setAuthObject(authObject: AuthObject) {
    sessionStorage.setItem("authObject", JSON.stringify(authObject));
  }

  static clearSession() {
    sessionStorage.removeItem("authObject");
  }
}
