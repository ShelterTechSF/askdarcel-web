import React from 'react';
import PropTypes from 'prop-types';
import { RecurringSchedule } from '../../utils/RecurringSchedule';


// TODO order with current day first
// TODO Show relativeOpeningTime for current day
// TODO Show days without entries in the schedule as closed
// TODO Order with current day at top
export const TableOfOpeningTimes = ({ recurringSchedule }) => (
  <table className="compact">
    <tbody>
      { recurringSchedule.intervals.map(interval => {
        const opensAt = interval.opensAt.timeString();
        const closesAt = interval.closesAt.timeString();
        return (
          <tr key={interval.key()}>
            <th>{ interval.opensAt.dayString() }</th>
            <td>{ `${opensAt} - ${closesAt}` }</td>
          </tr>
        );
      }) }
    </tbody>
  </table>
);

TableOfOpeningTimes.propTypes = {
  recurringSchedule: PropTypes.instanceOf(RecurringSchedule).isRequired,
};
