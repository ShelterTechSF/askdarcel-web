import type { AuthState, UserSignUpData } from "components/AppProvider";

/**
  This file provides methods to sync a user's auth state, which is managed by the AppProvider
  component, with the browser's sessionStorage; this enables the app to get the user's auth data
  upon refreshing the page, etc., and to then reset the auth state.
*/

export const getAuthObject = (): AuthState | null => {
  const object = sessionStorage.getItem("authObject");
  return object ? JSON.parse(object) : null;
};

export const setAuthObject = (authObject: AuthState) => {
  sessionStorage.setItem("authObject", JSON.stringify(authObject));
};

export const clearSession = () => {
  sessionStorage.removeItem("authObject");
};

export const setUserSignUpData = (userData: UserSignUpData) => {
  sessionStorage.setItem("userSignUpData", JSON.stringify(userData));
};

export const hasUserSignupData = (): boolean => {
  const object = sessionStorage.getItem("userSignUpData");
  return !!object;
};

export const getUserSignUpData = (): UserSignUpData | null => {
  const object = sessionStorage.getItem("userSignUpData");
  return object ? JSON.parse(object) : null;
};

export const clearUserSignUpData = () => {
  sessionStorage.removeItem("userSignUpData");
};
