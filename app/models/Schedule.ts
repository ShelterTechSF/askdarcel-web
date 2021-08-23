import * as Sentry from '@sentry/browser';
import type { Service } from './Service';
import {
  RecurringTime,
  RecurringSchedule,
  RecurringInterval,
  DAY_TO_INT,
  MINUTES_IN_HOUR,
  DAYS_IN_WEEK,
} from './RecurringSchedule';

export interface Schedule {
  id: number
  hours_known: boolean
  schedule_days: ScheduleDay[]
}

export interface ScheduleDay {
  id: number
  day: keyof typeof DAY_TO_INT
  opens_at: number | null
  closes_at: number | null
}

export const shouldInheritSchedule = (service: Service) => (
  service.schedule && service.schedule.schedule_days.length > 0
);

/**
 * Convert time from concatenated hours-minutes integer format to hour and
 * minute.
 *
 * E.g.
 * 700 to { hour: 7, minute: 0 }
 * 1330 to { hour: 13, minute: 30 }
 *
 * @param {int} integerTime - An "integer" that represents an hours and minutes
 *  time. The thousands and hundreds digits represent the hour and the tens and
 *  ones digits represent the minute.
 * @returns {object} - An object with an `hour` property and a `minute`
 *  property, both represented as integers.
 */
export const parseConcatenatedIntegerTime = (integerTime: number) => {
  try {
    // This algorithm is super hacky and slow, as it uses strings to separate the
    // hours digits from the minutes digits.
    const timeString = integerTime.toString();
    const hourString = timeString.substring(0, timeString.length - 2);
    const minuteString = timeString.substring(timeString.length - 2, timeString.length);
    const hour = hourString.length ? parseInt(hourString, 10) : 0;
    const minute = parseInt(minuteString, 10);
    return { hour, minute };
  } catch (e) {
    Sentry.captureException(e);
    return null;
  }
};

/** Transform API ScheduleDay into a RecurringInterval. */
const parseAPIScheduleDay = (apiScheduleDay: ScheduleDay) => {
  const opensAtTime = parseConcatenatedIntegerTime(apiScheduleDay.opens_at || 0);
  const closesAtTime = parseConcatenatedIntegerTime(apiScheduleDay.closes_at || 0);
  if (opensAtTime === null || closesAtTime === null) {
    Sentry.captureMessage(`ScheduleDay has null times: ${JSON.stringify(apiScheduleDay)}`);
    return null;
  }

  const opensAtMinutes = opensAtTime.hour * MINUTES_IN_HOUR + opensAtTime.minute;
  const closesAtMinutes = closesAtTime.hour * MINUTES_IN_HOUR + closesAtTime.minute;
  const opensAt = new RecurringTime({
    day: DAY_TO_INT[apiScheduleDay.day],
    hour: opensAtTime.hour,
    minute: opensAtTime.minute,
  });
  const closesAt = new RecurringTime({
    day: (
      DAY_TO_INT[apiScheduleDay.day]
        + (closesAtMinutes < opensAtMinutes ? 1 : 0)
    ) % DAYS_IN_WEEK,
    hour: closesAtTime.hour,
    minute: closesAtTime.minute,
  });
  return new RecurringInterval({ opensAt, closesAt });
};

/** Transform API Schedule into a RecurringSchedule. */
export const parseAPISchedule = (apiSchedule: Schedule) => new RecurringSchedule({
  intervals: apiSchedule.schedule_days
    .map(apiScheduleDay => parseAPIScheduleDay(apiScheduleDay))
    .filter(interval => interval),
  hoursKnown: apiSchedule.hours_known,
});

export const parseAlgoliaSchedule = algoliaSchedule => new RecurringSchedule({
  intervals: algoliaSchedule.map(parseAPIScheduleDay).filter(interval => interval),
});
