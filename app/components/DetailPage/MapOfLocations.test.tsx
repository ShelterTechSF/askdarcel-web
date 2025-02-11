import React from "react";
import { render, screen } from "@testing-library/react";
import { AppContext } from "utils";
import { MapOfLocations } from "./MapOfLocations";
import { AroundRadius } from "algoliasearch";

const FAKE_LOCATIONS = [
  {
    id: 1,
    address: {
      latitude: "34.0522",
      longitude: "-118.2437",
      id: 1,
      attention: null,
      name: null,
      address_1: "123 Main St",
      address_2: null,
      address_3: null,
      address_4: null,
      city: "Anywhere",
      state_province: "CA",
      postal_code: "90038",
    },
    name: "Location 1",
    recurringSchedule: {
      intervals: [],
      hoursKnown: true,
      isOpen24_7: () => false,
      findNearestInterval: () => undefined,
      isOpen: () => false,
    },
  },
  {
    id: 2,
    address: {
      latitude: "37.7749",
      longitude: "-122.4194",
      id: 2,
      attention: null,
      name: null,
      address_1: "345 Fake St",
      address_2: null,
      address_3: null,
      address_4: null,
      city: "Everywhere",
      state_province: "CA",
      postal_code: "90038",
    },
    name: "Location 1",
    recurringSchedule: {
      intervals: [],
      hoursKnown: true,
      isOpen24_7: () => false,
      findNearestInterval: () => undefined,
      isOpen: () => false,
    },
  },
];

describe("MapOfLocations", () => {
  it("renders the correct markers", () => {
    const mockContextValue = {
      userLocation: {
        coords: { lat: 37.7749, lng: -122.4194 },
        inSanFrancisco: true,
      },
      aroundUserLocationRadius: "all" as AroundRadius,
      aroundLatLng: "37.7749,-122.4194",
    };

    render(
      <AppContext.Provider value={mockContextValue}>
        <MapOfLocations locations={FAKE_LOCATIONS} />
      </AppContext.Provider>
    );

    expect(screen.getAllByTestId("user-location-marker").length).toEqual(1);
    expect(screen.getAllByTestId("custom-marker").length).toEqual(2);
    expect(screen.getByText("1. 123 Main St")).toBeInTheDocument();
    expect(screen.getByText("2. 345 Fake St")).toBeInTheDocument();
  });

  it("does not render the user-location-marker if user is outside of San Francisco and inSanFrancisco is true,", () => {
    const mockContextValue = {
      userLocation: {
        coords: { lat: 37.7749, lng: -122.4194 },
        inSanFrancisco: false,
      },
      aroundUserLocationRadius: "all" as AroundRadius,
      aroundLatLng: "37.7749,-122.4194",
    };

    render(
      <AppContext.Provider value={mockContextValue}>
        <MapOfLocations locations={FAKE_LOCATIONS} />
      </AppContext.Provider>
    );

    expect(
      screen.queryByTestId("user-location-marker")
    ).not.toBeInTheDocument();
    expect(screen.getAllByTestId("custom-marker").length).toEqual(2);
    expect(screen.getByText("1. 123 Main St")).toBeInTheDocument();
    expect(screen.getByText("2. 345 Fake St")).toBeInTheDocument();
  });
});
