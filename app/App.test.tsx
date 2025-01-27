import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { App } from "App";
import { HelmetProvider } from "react-helmet-async";
import { AppProvider } from "utils";

jest.mock("instantsearch.js/es/lib/routers", () => ({}));
jest.mock("./utils/useAppContext", () => ({
  AppProvider: jest.fn(),
}));

describe("<App />", () => {
  it("renders", async () => {
    render(
      <HelmetProvider>
        <App />
      </HelmetProvider>,
      { wrapper: BrowserRouter }
    );

    await waitFor(() => {
      expect(screen.getByTestId("app-container")).toBeInTheDocument();
    });
  });

  // Until we can design a test that reflects real user behavior, lets test that
  // the default `AppProvider` props are created and set correctly by mocking
  // the component.
  it("sends the correct props to the <AppProvider />", async () => {
    const expectedProps = expect.objectContaining({
      aroundLatLng: "37.7749,-122.4194",
      userLocation: { lat: 37.7749, lng: -122.4194 },
      aroundUserLocationRadius: "all",
      setAroundRadius: expect.any(Function),
      setAroundLatLng: expect.any(Function),
    });

    // https://stackoverflow.com/questions/56879095/what-is-the-second-parameter-for-in-a-react-functional-component
    const legacyRefOrContextArgument = expect.anything();

    render(
      <HelmetProvider>
        <App />
      </HelmetProvider>,
      { wrapper: BrowserRouter }
    );

    await waitFor(() => {
      expect(AppProvider).toHaveBeenCalledWith(
        expectedProps,
        legacyRefOrContextArgument
      );
    });
  });
});
