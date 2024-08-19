import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import { ServiceCard } from "../../ui/Cards/ServiceCard";

describe("<ServiceCard />", () => {
  const validService = {
    id: 2,
    name: "Test Service",
    long_description: "This valuable service does things",
  };

  it("checks a valid user should render the appropriate fields in the right place", () => {
    render(<ServiceCard service={validService} />, { wrapper: BrowserRouter });
    expect(screen.getByRole("heading")).toHaveTextContent("Test Service");
    expect(screen.getByTestId("service-card-description")).toHaveTextContent(
      validService.long_description
    );
  });
});
