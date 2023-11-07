import type { AuthState } from "components/AppProvider";

export default class SessionCacher {
  static getAuthObject(): AuthState {
    const object = sessionStorage.getItem("authObject");
    return object ? JSON.parse(object) : null;
  }

  static setAuthObject(authObject: AuthState) {
    sessionStorage.setItem("authObject", JSON.stringify(authObject));
  }

  static clearSession() {
    sessionStorage.removeItem("authObject");
  }
}
