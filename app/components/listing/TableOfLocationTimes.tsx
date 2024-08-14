import React from "react";
import { RecurringSchedule } from "../../models/RecurringSchedule";
import styles from "./TableOfLocationTimes.module.scss";

// TODO order with current day first
// TODO Show relativeOpeningTime for current day
// TODO Show days without entries in the schedule as closed
// TODO Order with current day at top
export const TableOfLocationTimes = ({
  recurringSchedule,
}: {
  recurringSchedule: RecurringSchedule;
}) => (
  <table className={styles.openingTimesTable}>
    <caption className="sr-only">Location Hours</caption>
    <thead className="sr-only">
      <tr>
        <th scope="col">Day</th>
        <th scope="col">Hours</th>
      </tr>
    </thead>
    <tbody>
      {(recurringSchedule.hoursKnown &&
        recurringSchedule.intervals.map((interval) => {
          const opensAt = interval.opensAt.timeString();
          const closesAt = interval.closesAt.timeString();
          return (
            <tr key={interval.key()} data-cy="opening-times-row">
              <th scope="row">{interval.opensAt.dayString()}</th>
              <td>{`${opensAt} - ${closesAt}`}</td>
            </tr>
          );
        })) || (
        <tr>
          <td>Call for Hours</td>
        </tr>
      )}
    </tbody>
  </table>
);
