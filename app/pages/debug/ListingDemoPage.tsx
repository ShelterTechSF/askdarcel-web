import React from 'react';
import { RelativeOpeningTime } from '../../components/listing/RelativeOpeningTime';
import {
  RecurringInterval,
  RecurringSchedule,
  RecurringTime,
  parseConcatenatedIntegerTime,
} from '../../models';
import './ListingDemoPage.scss';

type Interval = readonly [number, number];
type DaySchedule = null | Interval | readonly Interval[];
type WeekSchedule = readonly DaySchedule[];

// Is sorted so that the first day is today
/* eslint-disable max-len */
export const simpleScheduleLookup = {
  twenty_four_seven: [[0, 2359], [0, 2359], [0, 2359], [0, 2359], [0, 2359], [0, 2359], [0, 2359]],
  twenty_four_hours_today: [[0, 2359], null, null, null, null, null, null],
  closed_today: [null, null, [900, 1800], [900, 1800]],
  nine_to_six: [[900, 1800], [900, 1800], [900, 1800], [900, 1800], [900, 1800], [900, 1200]],
  random1: [[[915, 1130], [1300, 1800]], [900, 1800], [900, 1800], [900, 1800], [900, 1800], [900, 1200], [900, 1200]],
  random2: [[0, 2359], [900, 1800], [900, 1800], [900, 1800], [900, 1800], [900, 1200], [0, 2359]],
  random3: [[0, 900], [900, 1800], [900, 1800], [900, 1800], [900, 1800], [900, 1200], null], // Closed all sunday, 24h Mon
  random4: [[200, 1800], [0, 2359], [0, 2359], [0, 2359], [0, 2359], [0, 2359], [0, 2125]],
  random5: [[0, 2359], [0, 2359], [0, 2359], [0, 2359], [0, 2359], [0, 2359], [2155, 2300]],
  random6: [[0, 1100], [0, 2359], [0, 2359], [0, 2359], [0, 2359], [0, 2359], [2155, 2300]],
  random7: [[1000, 2300], [0, 2359], [0, 2359], [0, 2359], [0, 2359], [0, 2359], null],
  random8: [[[2330, 1200], [1800, 2000], [2200, 2359]], null, [0, 2359], [0, 2359], [0, 2359], [0, 2359], [900, 2200]],
  closes_tomorrow: [[1800, 900], [0, 2359], [0, 2359], [0, 2359], [0, 2359], [0, 2359], [[0, 900], [1100, 1800], [1900, 2300]]],
} as const;
/* eslint-enable max-len */

const simpleSchedules = Object.values(simpleScheduleLookup);

/** Return true if x is an Interval[]; false if it is only an Interval.
 *
 * This is a user-defined type guard, since TypeScript is unable to infer the
 * correct type normally.
 *
 * For more information on user-defined type guards, see:
 * https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
 */
function isIntervalArray(x: Interval | readonly Interval[]): x is readonly Interval[] {
  return Array.isArray(x[0]);
}

export const createScheduleFromShorthand = (shedule_shorthand: WeekSchedule[]) => {
  const today = new Date().getDay();
  const schedules = shedule_shorthand.map(shorthandSchedule => {
    const intervals = shorthandSchedule.flatMap((day, i) => {
      if (day === null) { return []; }

      const instancesOfToday = isIntervalArray(day) ? day : [day];
      // Shift days such that 0 maps to the current day.
      const adjustedDay = (i + today) % 7;
      return instancesOfToday.map(([opensAt, closesAt]) => {
        const {
          hour: opensAtHour,
          minute: opensAtMinute,
        } = parseConcatenatedIntegerTime(opensAt)!;
        const {
          hour: closesAtHour,
          minute: closesAtMinute,
        } = parseConcatenatedIntegerTime(closesAt)!;
        const adjustedClosesAtDay = closesAt < opensAt ? (adjustedDay + 1) % 7 : adjustedDay;
        return new RecurringInterval({
          opensAt: new RecurringTime({
            day: adjustedDay,
            hour: opensAtHour,
            minute: opensAtMinute,
          }),
          closesAt: new RecurringTime({
            day: adjustedClosesAtDay,
            hour: closesAtHour,
            minute: closesAtMinute,
          }),
        });
      });
    });
    return new RecurringSchedule({ intervals });
  });

  return schedules;
};

export class ListingDebugPage extends React.Component {
  render() {
    const recurringSchedules = createScheduleFromShorthand(simpleSchedules);
    return (
      <div className="demo-page">
        <h1>RelativeOpeningTime</h1>
        { recurringSchedules.map(recurringSchedule => (
          <p>
            <RelativeOpeningTime recurringSchedule={recurringSchedule} />
            {/* <pre>{ JSON.stringify(recurringSchedule, null, 2) }</pre> */}
          </p>
        )) }
      </div>
    );
  }
}
