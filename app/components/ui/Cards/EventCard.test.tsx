import React from "react";
import { render, screen } from "@testing-library/react";
import { EventCard } from "./EventCard";
import { createFormattedHomePageEventsData } from "../../../../test/fixtures/EventsData";

describe("<EventCard />", () => {
  const eventData = createFormattedHomePageEventsData()[0];

  it("displays title, link, date, and call to action", () => {
    render(<EventCard event={eventData} />);

    const selectors = [
      screen.getByTestId("eventcard-title"),
      screen.getByTestId("eventcard-link"),
      screen.getByTestId("eventcard-formatteddate"),
      screen.getByTestId("button-visualonly"),
    ];

    selectors.forEach((el) => expect(el).toBeInTheDocument());
  });
});
