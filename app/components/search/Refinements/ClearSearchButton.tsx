import React from "react";
import { Button } from "components/ui/inline/Button/Button";

const ClearSearchButton = () => {
  return (
    <Button variant="linkBlue" size="lg" href="/search" mobileFullWidth={false}>
      Clear Search
    </Button>
  );
};

export default ClearSearchButton;
