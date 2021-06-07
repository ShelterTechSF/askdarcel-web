import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { RecurringScheduleModel, getRelativeOpeningTime } from '../../models';

export const WeeklyHours = ({ recurringSchedule }: { recurringSchedule: RecurringScheduleModel }) => (
  <li className="service--details--item">
    <header>Hours</header>
    <div className="service--details--item--info">
      <DetailedHours recurringSchedule={recurringSchedule} />
    </div>
  </li>
);

export const DetailedHours = ({ recurringSchedule }: { recurringSchedule: RecurringScheduleModel }) => (
  <span className="weekly-hours-list">
    {
      (
        recurringSchedule.hoursKnown
          ? (recurringSchedule.intervals.map(interval => (
            <div key={interval.key()} className="weekly-hours-list--item">
              <span className="weekly-hours-list--item--day">{interval.opensAt.dayString()}</span>
              <span className="weekly-hours-list--item--hours">
                { interval.is24Hours()
                  ? '24 Hours'
                  : `${interval.opensAt.timeString()} - ${interval.closesAt.timeString()}`
                }
              </span>
            </div>
          )))
          : (<div className="weekly-hours-list--item">Call for Hours</div>)
      )
    }
  </span>
);

export const RelativeOpeningTime = ({ currentDate, recurringSchedule }: { currentDate: any, recurringSchedule: any }) => {
  const [state, setState] = useState({ text: '', classes: '' });

  useEffect(() => {
    const t = setInterval(() => {
      const { text, classes } = getRelativeOpeningTime(currentDate, recurringSchedule);
      setState({ text, classes });
    });
    return () => clearInterval(t);
  }, [currentDate, recurringSchedule]);

  return (
    <span className={`relative-opening-time ${state.classes}`}>
      { state.text }
    </span>
  );
};

// TODO order with current day first
// TODO Show relativeOpeningTime for current day
// TODO Show days without entries in the schedule as closed
// TODO Order with current day at top
export const TableOfOpeningTimes = ({ recurringSchedule }: { recurringSchedule: RecurringScheduleModel }) => (
  <table className="compact">
    <tbody>
      {
        (recurringSchedule.hoursKnown
          && recurringSchedule.intervals.map(interval => {
            const opensAt = interval.opensAt.timeString();
            const closesAt = interval.closesAt.timeString();
            return (
              <tr key={interval.key()}>
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
