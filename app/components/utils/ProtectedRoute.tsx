import React from "react";
import {
  Redirect,
  Route,
  RouteComponentProps,
  RouteProps,
} from "react-router-dom";

interface ProtectedRouteProps extends RouteProps {
  // The type here is copied from the react-router component typing in react-router/index.d.ts
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>;
  isAuthenticated: boolean;
}

export const ProtectedRoute = ({
  component: Component,
  isAuthenticated,
  ...rest
}: ProtectedRouteProps) => {
  console.log("Attempted navigation to protected route. Is authenticated value: ", isAuthenticated)
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/log-in" }} />
        )
      }
    />
  );
};
