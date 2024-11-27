/**
 * Template for a simple component test
 *
 * Usage: Duplicate this file and rename it using your component name. Happy
 * coding from there!
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { HomePage } from "pages/HomePage/HomePage";
import { HOME_PAGE_DATA } from "../../../test/fixtures/HomePageData";
import { Homepage, StrapiDatum } from "models/Strapi";

const mock: {
  data: {
    attributes: null | StrapiDatum<Homepage>["attributes"];
  };
} = {
  data: {
    attributes: null,
  },
};
jest.mock("hooks/StrapiAPI", () => ({
  useHomepageData: () => mock,
}));

describe("<HomePage />", () => {
  it("renders", () => {
    mock.data.attributes = HOME_PAGE_DATA;
    render(<HomePage />, { wrapper: BrowserRouter });
    expect(screen.getByTestId("homepage-title")).toHaveTextContent("Homepage");
    expect(screen.getByTestId("hero")).toBeInTheDocument();
    expect(screen.getByTestId("homepage-section")).toBeInTheDocument();
    expect(
      screen.getByTestId("two-column-content-section")
    ).toBeInTheDocument();
  });
});
