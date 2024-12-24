import React from "react";
import { render, screen } from "@testing-library/react";
import { EventDetailPage } from "pages/EventDetailPage/EventDetailPage";
import {
  createFormattedEventData,
  EVENTS_DATA,
} from "../../../test/fixtures/EventsData";
import { useEventData } from "hooks/StrapiAPI";
import { HelmetProvider } from "react-helmet-async";

let MOCK_EVENT: {
  data: ReturnType<typeof useEventData>["data"] | null;
  error: ReturnType<typeof useEventData>["error"];
  isLoading: ReturnType<typeof useEventData>["isLoading"];
} = {
  data: null,
  error: null,
  isLoading: false,
};

jest.mock("hooks/StrapiAPI", () => ({
  useEventData: () => MOCK_EVENT,
}));

global.scrollTo = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();
});

it("displays every page section and table row", async () => {
  MOCK_EVENT = {
    data: createFormattedEventData(),
    error: null,
    isLoading: false,
  };

  render(
    <HelmetProvider>
      <EventDetailPage />
    </HelmetProvider>
  );

  expect(
    screen.getAllByTestId("eventdetailpage-detailinfosection").length
  ).toEqual(4);
  [
    "About",
    "Details",
    "Registration",
    "Tags",
    "Date & Time",
    "Event Link",
    "Categories",
    "Eligibilities",
    "Age Group",
  ].forEach((event) => {
    expect(screen.getByText(event)).toBeInTheDocument();
  });
});
