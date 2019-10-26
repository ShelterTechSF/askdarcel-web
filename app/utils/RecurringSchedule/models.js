/**
 * Data structures used for consistently representing time throughout the app.
 */
import { sortBy } from 'lodash';

import { INT_TO_DAY } from './constants';


/**
 * Return new array with RecurringIntervals sorted by opening time, with Sunday
 * midnight as the earliest time.
 *
 * @param {Array<RecurringInterval>}
 * @returns {Array<RecurringInterval>}
 */
const sortIntervals = intervals => (
  sortBy(intervals, [
    i => i.opensAt.day,
    i => i.opensAt.hour,
    i => i.opensAt.minute,
  ])
);


export class RecurringTime {
  /**
   * Create a weekly recurring time object, which consists of a day of week, an
   * hour, and a minute.
   *
   * @param {int} day - Day of the week represented as an integer, where
   * @param {int} hour - The hour of day in 24-hour time; e.g. midnight == 0.
   * @param {int} minute - Minute of the hour.
   *  Sunday == 0.
   */
  constructor({ day, hour, minute }) {
    this.day = day;
    this.hour = hour;
    this.minute = minute;
  }

  /**
   * Key that is suitable for React array.
   */
  key() {
    return `${this.dayString()}-${this.timeString()}`;
  }

  /**
   * Format the time as hh:mm AM/PM.
   */
  timeString() {
    const ampm = this.hour > 11 ? 'PM' : 'AM';
    let normalizedHour = this.hour;
    if (normalizedHour === 0) {
      normalizedHour = 12;
    } else if (normalizedHour > 12) {
      normalizedHour -= 12;
    }
    const formattedMinute = this.minute.toString().padStart(2, '0');
    return `${normalizedHour}:${formattedMinute} ${ampm}`;
  }

  dayString() {
    return INT_TO_DAY[this.day];
  }
}


export class RecurringInterval {
  /**
   * Create a RecurringInterval, which consists of a pair of recurring open and
   * close times.
   *
   * This interval represents a half-open interval where `opensAt` is inclusive
   * and `closesAt` is exclusive.
   *
   * @param opensAt {RecurringTime} - Recurring open time.
   * @param closesAt {RecurringTime} - Recurring close time.
   */
  constructor({ opensAt, closesAt }) {
    this.opensAt = opensAt;
    this.closesAt = closesAt;
  }

  /**
   * Key that is suitable for React array.
   */
  key() {
    return this.opensAt.key();
  }
}


export class RecurringSchedule {
  /**
   * Create a Schedule, which is a collection of RecurringIntervals.
   *
   * @param intervals {Array<RecurringInterval>} - The list of
   *  RecurringIntervals comprising the schedule.
   */
  constructor({ intervals }) {
    this.intervals = sortIntervals(intervals);
  }
}
