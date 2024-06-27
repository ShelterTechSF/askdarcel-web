import React from "react";
import {
  Redirect,
  Route,
  RouteComponentProps,
  RouteProps,
} from "react-router-dom";

interface PublicRouteProps extends RouteProps {
  // The type here is copied from the react-router component typing in react-router/index.d.ts
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>;
  isAuthenticated: boolean;
  redirectTo?: string;
}

export const PublicRoute = ({
  component: Component,
  isAuthenticated,
  redirectTo = "/",
  ...rest
}: PublicRouteProps) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        !isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: redirectTo }} />
        )
      }
    />
  );
};
