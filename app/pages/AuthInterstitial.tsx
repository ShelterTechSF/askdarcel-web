import React, {useEffect} from "react";
import { useHistory } from "react-router-dom";
import * as AuthService from "utils/AuthService";
import { useAppContext } from "utils";
import { Loader } from "components/ui";

export const AuthInterstitial = () => {
  const { authClient, setAuthState } = useAppContext();
  const history = useHistory();

  useEffect(() => {
    const { hash } = window.location;
    if (!hash || !hash.includes("access_token")) {
      return;
    }


    AuthService.initializeUserSession(
      window.location.hash,
      authClient,
      setAuthState,
    ).then(() => {
      history.push("navigator-dashboard");
    });
  }, [history, setAuthState, authClient]);

  return (
    <div>
      <Loader/>
      Preparing your dashboard...
    </div>
  );
}