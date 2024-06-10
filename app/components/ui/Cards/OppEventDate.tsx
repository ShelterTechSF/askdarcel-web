import React from "react";
import formatEventTime from "utils/formatEventTime";

interface OppEventDateProps {
  startDate?: Date;
  endDate?: Date;
}

export const OppEventDate = (props: OppEventDateProps) => {
  const { startDate, endDate } = props;
  const start = formatEventTime(startDate);
  const end = formatEventTime(endDate);
  const isSingleDayEvent = start.date === end.date;
  const hasEndTime = start.time !== end.time;

  if (isSingleDayEvent) {
    return (
      <p>
        {`${start.date} · ${start.time} ${hasEndTime ? `- ${end.time} ` : ""}`}
      </p>
    );
  }

  return <p>{`${start.date} - ${end.date}`}</p>;
};
