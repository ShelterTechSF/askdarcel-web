import { createContext, useContext } from "react";
import auth0 from "auth0-js";
import { GeoCoordinates } from "./location";



const passwordlessStart = (evt: React.SyntheticEvent, email: string, callback: () => void) => {
  evt.preventDefault();
  webAuth.passwordlessStart(
    {
      connection: "email",
      send: "code",
      email,
    },
    (err) => {
      if (err) {
        console.log(err);
        return;
      }

      callback();
    }
  );
};

// export const InitialContext =

export const AppContext = createContext({
  userLocation: <GeoCoordinates | null>null,
  authState: {
    isAuthenticated: false,
    user: {
      name: '',
      email: '',
    }
  },
  webAuth,
  passwordlessStart
});
console.log(AppContext)

export const useAppContext = () => useContext(AppContext);
