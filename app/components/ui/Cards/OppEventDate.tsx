import React from "react";
import formatEventTime from "utils/formatEventTime";

interface OppEventDateProps {
  startDate?: Date;
  endDate?: Date;
  sectionType: "event" | "opportunity";
}

export const OppEventDate = (props: OppEventDateProps) => {
  const { startDate, endDate, sectionType } = props;
  const start = formatEventTime(startDate);
  const end = formatEventTime(endDate);
  const hasEndTime = start.time !== end.time;

  if (sectionType === "opportunity") {
    return (
      <>
        <p>{start.date}</p>
        <span>-</span>
        <p>{end.date}</p>
      </>
    );
  }

  return (
    <>
      <p>{start.date}</p>
      <span>·</span>
      <p>{start.time}</p>

      {hasEndTime && (
        <>
          <span>-</span>
          <p>{end.time}</p>
        </>
      )}
    </>
  );
};
