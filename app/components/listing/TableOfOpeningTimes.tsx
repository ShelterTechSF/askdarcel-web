import React from 'react';
import { RecurringSchedule } from '../../models/RecurringSchedule';

// TODO order with current day first
// TODO Show relativeOpeningTime for current day
// TODO Show days without entries in the schedule as closed
// TODO Order with current day at top
export function TableOfOpeningTimes({ recurringSchedule }: {
  recurringSchedule: RecurringSchedule;
}) {
  return (
    <table className="compact">
      <tbody>
        {
        (recurringSchedule.hoursKnown
          && recurringSchedule.intervals.map(interval => {
            const opensAt = interval.opensAt.timeString();
            const closesAt = interval.closesAt.timeString();
            return (
              <tr key={interval.key()} data-cy="opening-times-row">
                <th>{ interval.opensAt.dayString() }</th>
                <td>{ `${opensAt} - ${closesAt}` }</td>
              </tr>
            );
          }))
        || <tr><th>Call for Hours</th></tr>
      }
      </tbody>
    </table>
  );
}
