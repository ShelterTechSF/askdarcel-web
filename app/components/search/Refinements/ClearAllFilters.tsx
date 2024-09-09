import React from "react";

import { Button } from "components/ui/inline/Button/Button";
import { useClearRefinements } from "react-instantsearch";
import { AroundRadius } from "algoliasearch";

/**
 * Filter clearing component that handles both facet clearing and map boundary reset
 */
const ClearAllFilter = ({
  setSearchRadius,
}: {
  setSearchRadius: (radius: AroundRadius) => void;
}) => {
  const { refine } = useClearRefinements();
  return (
    <Button
      tabIndex={0}
      variant="linkBlue"
      onClick={() => {
        refine();
        setSearchRadius("all");
      }}
      mobileFullWidth={false}
      size="lg"
    >
      Clear all
    </Button>
  );
};

export default ClearAllFilter;
