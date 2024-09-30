import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import { MobileNavigation } from "components/ui/Navigation/MobileNavigation";

describe("<MobileNavigation />", () => {
  it("checks a valid user should render the appropriate fields in the right place", () => {
    render(<MobileNavigation menuData={[]} />, { wrapper: BrowserRouter });
  });
});
