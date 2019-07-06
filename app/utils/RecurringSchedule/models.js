/**
 * Data structures used for consistently representing time throughout the app.
 */
import { minBy, sortBy } from 'lodash';

import {
  DAYS_IN_WEEK, HOURS_IN_DAY, INT_TO_DAY, MINUTES_IN_HOUR,
} from './constants';


const MINUTES_IN_WEEK = MINUTES_IN_HOUR * HOURS_IN_DAY * DAYS_IN_WEEK;


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


/**
 * Models a time duration, such as 2 days, 1 hour, 30 minutes.
 */
export class Duration {
  /**
   * Constructor for Duration. This is not meant to be used as a public method.
   * Use one of the static method constructors instead.
   */
  constructor(minutes) {
    this.minutes = minutes;
  }

  /**
   * Create duration from minutes.
   */
  static fromMinutes(minutes) {
    return new Duration(minutes);
  }

  asMinutes() {
    return this.minutes;
  }

  /**
   * Return primitive value of Duration so that comparison operators work.
   */
  valueOf() {
    return this.asMinutes();
  }

  /** String representation when using console.log() */
  inspect() {
    return `${this.asMinutes()} minutes`;
  }
}


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
   * Take the difference of two RecurringTimes as a Duration.
   *
   * @param {RecurringTime} otherTime
   * @returns {Duration}
   */
  difference(otherTime) {
    /**
     * Compute the modulus of a divided by n, forcing the result into a nonnegative
     * number. The builtin JavaScript operator % will return a negative number if a
     * is negative, so here we force the result into a number between 0 and n;
     *
     * @param {number} a - The dividend.
     * @param {number} n - The divisor.
     * @returns {number} - The remainder.
     */
    const modulo = (a, n) => ((a % n) + n) % n;

    /**
     * Normalize RecurringTime into a number of minutes since Sunday midnight.
     *
     * @param {RecurringTime} time
     * @returns {int}
     */
    const asMinutes = time => {
      const hours = (time.day * HOURS_IN_DAY) + time.hour;
      return hours * MINUTES_IN_HOUR + time.minute;
    };

    return Duration.fromMinutes(modulo(
      asMinutes(this) - asMinutes(otherTime),
      MINUTES_IN_WEEK,
    ));
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

  /** String representation when using console.log() */
  inspect() {
    return `${this.dayString()}-${this.timeString()}`;
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

  is24Hours() {
    return (
      this.opensAt.hour === 0
      && this.opensAt.minute === 0
      && this.closesAt.hour === 23
      && this.closesAt.minute === 59
    );
  }

  /**
   * Check if interval overlaps with target time.
   *
   * This interval overlaps with a target time if opensAt <= targetTime <
   * closesAt. The one exception is when the interval represents an "open 24
   * hours" interval, in which case the `closesAt` time is treated as an
   * inclusive upper bound. This exception is only implemented for consistency
   * with the API representation of a 24-hour schedule.
   *
   * Note that time is cyclical here; i.e. the week wraps after Saturday 23:59
   * to Sunday 00:00. The overlap check should correctly handle intervals that
   * span the wrapover point.
   *
   * https://fgiesen.wordpress.com/2015/09/24/intervals-in-modular-arithmetic/
   *
   * @param {RecurringTime} targetTime - A RecurringTime representing the time
   *  to check for an overlap with.
   * @returns {boolean}
   */
  overlapsTime(targetTime) {
    if (this.is24Hours() && this.opensAt.day === targetTime.day) {
      return true;
    }

    // Given a modular interval [a, b) mod n, x is within the interval iff
    // (x - a) mod n < (b - a) mod n.
    return targetTime.difference(this.opensAt) < this.closesAt.difference(this.opensAt);
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

  /**
   * True if and only if schedule is open 24 hours, 7 days a week.
   */
  isOpen24_7() {
    // HACK: This assumes that there are no overlapping days of the week and
    // that schedule days don't span more than one day.
    const daysOpen24 = this.intervals.filter(i => i.is24Hours());
    return daysOpen24.length === 7;
  }

  /**
   * Find the nearest interval to the target time.
   *
   * If an interval overlaps target time, then return the overlapping interval.
   * Otherwise, return the interval that will start the soonest after the target
   * time.
   *
   * @param {RecurringTime} targetTime - The target time.
   */
  findNearestInterval(targetTime) {
    if (!this.intervals.length) {
      return undefined;
    }

    const overlappingInterval = this.intervals.find(
      interval => interval.overlapsTime(targetTime),
    );
    if (overlappingInterval) {
      return overlappingInterval;
    }

    // If we don't overlap anything, find the nearest schedule by opensAt time.
    const nextByOpensAt = minBy(
      this.intervals,
      interval => interval.opensAt.difference(targetTime),
    );
    return nextByOpensAt;
  }
}
