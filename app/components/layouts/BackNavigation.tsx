import React from "react";

import { Button } from "components/ui/inline/Button/Button";
import { useHistory } from "react-router-dom";

// Renders a smart back link that handles pages visited directly or from referring page
export const BackNavigation = ({
  defaultReturnTo,
}: {
  defaultReturnTo: string;
}) => {
  const history = useHistory();

  // The "POP" action is reserved as a default action for newly created history objects. `react-router-dom` depends on
  // another history library that defines this behavior. Read more:
  // https://github.com/remix-run/history/blob/main/docs/api-reference.md#reference
  const backDestination =
    history.action === "POP"
      ? () => history.push(defaultReturnTo)
      : () => history.goBack();

  return (
    <Button onClick={backDestination} variant="linkWhite" arrowVariant="before">
      Back to Service Listings
    </Button>
  );
};
