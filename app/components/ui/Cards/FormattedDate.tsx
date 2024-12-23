import { CalendarEvent } from "models/Strapi";
import React from "react";
import formatEventDate from "utils/formatEventDate";
import formatEventTime from "utils/formatEventTime";

// Renders a human-friendly date
export const FormattedDate = ({
  calendarEvent,
}: {
  calendarEvent: CalendarEvent;
}): JSX.Element => {
  const formattedStartDate = formatEventDate(calendarEvent.startdate);
  // If the end date is unset, let's assume it's a single day event and assign the enddate to the startdate
  const formattedEndDate = formatEventDate(
    calendarEvent.enddate || calendarEvent.startdate
  );
  const isSingleDayEvent = formattedStartDate === formattedEndDate;

  if (isSingleDayEvent) {
    const startTimeDateStr = `${calendarEvent.startdate} ${calendarEvent.starttime}`;
    const endTimeDateStr = `${calendarEvent.startdate} ${calendarEvent.endtime}`;
    const formattedStartTime = formatEventTime(startTimeDateStr);
    const formattedEndTime = formatEventTime(endTimeDateStr);

    // Defensively coding for a missing time fields until we get clearer direction from client about required data
    // fields
    const endTimeDisplay =
      formattedEndTime === "Invalid Date" ? "" : `- ${formattedEndTime}`;
    const starTimeDisplay =
      formattedStartTime === "Invalid Date" ? -1 : formattedStartTime;
    const timeDisplay =
      starTimeDisplay === -1 ? "" : `· ${formattedStartTime} ${endTimeDisplay}`;

    return (
      <p
        data-testid={"formatted-date-single"}
      >{`${formattedStartDate} ${timeDisplay}`}</p>
    );
  }

  return (
    <p
      data-testid={"formatted-date"}
    >{`${formattedStartDate} - ${formattedEndDate}`}</p>
  );
};
