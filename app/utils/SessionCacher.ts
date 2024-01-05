import type { AuthState } from "components/AppProvider";

/*
  This class exists to sync a user's auth state, which is managed by the AppProvider
  component, with the browser's sessionStorage; this enables the app to get the user's auth data
  upon refreshing the page, etc., and to then reset the auth state.
*/

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
