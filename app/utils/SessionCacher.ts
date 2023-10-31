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
  // static getAccessTokenObject() {
  //   const object = localStorage.getItem('accessTokenObject') || "";
  //   return JSON.parse(object);
  // }

  // static setAccessTokenObject(accessTokenObject: AccessTokenObject) {
  //   sessionStorage.setItem("accessTokenObject", JSON.stringify(accessTokenObject));
  // }

  // static getUserObject() {
  //   const object = localStorage.getItem('userObject') || "";
  //   return JSON.parse(object);
  // }

  // static setUserObject(userObject: UserObject) {
  //   sessionStorage.setItem("userObject", JSON.stringify(userObject));
  // }


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
