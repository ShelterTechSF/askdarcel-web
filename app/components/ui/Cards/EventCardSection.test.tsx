import React from "react";
import { render, screen } from "@testing-library/react";
import { EVENTS_DATA } from "../../../../test/fixtures/EventsData";
import { EventCardSection } from "components/ui/Cards/EventCardSection";

describe("<EventCardSection />", () => {
  const eventData = EVENTS_DATA;

  it("displays the correct number of event cards", () => {
    render(<EventCardSection events={eventData} />);

    expect(screen.getAllByTestId("eventcard")).toHaveLength(2);
  });
});
