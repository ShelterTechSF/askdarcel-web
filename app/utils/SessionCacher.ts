// interface AccessTokenObject {
//   token: string;
//   expiresAt: Date;
// }

// interface UserObject {
//   email: string;
//   id: string;
// }

interface AuthObject {
    isAuthenticated: boolean;
    user: {
        id: string;
        email: string;
    };
    accessToken: string;
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


  static getAuthObject() {
    const object = localStorage.getItem('authObject') || "";
    return JSON.parse(object);
  }

  static setAuthObject(authObject: AuthObject) {
    sessionStorage.setItem("authObject", JSON.stringify(authObject));
  }

  static clearSession() {
    sessionStorage.removeItem("authObject");
  }
}
