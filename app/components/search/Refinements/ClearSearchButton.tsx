import React from "react";
import { Button } from "components/ui/inline/Button/Button";
import { useSearchBox } from "react-instantsearch-core";

const ClearSearchButton = () => {
  const { clear } = useSearchBox();

  return (
    <Button
      variant="linkBlue"
      size="lg"
      mobileFullWidth={false}
      onClick={clear}
    >
      Clear Search
    </Button>
  );
};

export default ClearSearchButton;
