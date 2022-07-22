import * as Sentry from '@sentry/browser';
import {
  DAY_TO_INT,
  DAYS_IN_WEEK,
  MINUTES_IN_HOUR,
  RecurringTime,
  RecurringSchedule,
  RecurringInterval,
} from './RecurringSchedule';

export interface Schedule {
  id: number;
  hours_known: boolean;
  schedule_days: ScheduleDay[];
}

export interface ScheduleDay {
  id: number;
  day: keyof typeof DAY_TO_INT;
  opens_at: number | null;
  closes_at: number | null;
}

export interface ScheduleParams extends Omit<Partial<Schedule>, 'schedule_days'> {
  schedule_days: Partial<ScheduleDay>[];
}

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
export const parseConcatenatedIntegerTime = (integerTime: any) => {
  try {
    // This algorithm is super hacky and slow, as it uses strings to separate the
    // hours digits from the minutes digits.
    const timeString: string = integerTime.toString();
    const hourString: string = timeString.substring(0, timeString.length - 2);
    const minuteString: string = timeString.substring(timeString.length - 2, timeString.length);
    const hour: number = hourString.length ? parseInt(hourString, 10) : 0;
    const minute: number = parseInt(minuteString, 10);
    return { hour, minute };
  } catch (e) {
    Sentry.captureException(e);
    return null;
  }
};

/** Transform API ScheduleDay into a RecurringInterval. */
const parseAPIScheduleDay = (apiScheduleDay: ScheduleDay) => {
  const opensAtTime = parseConcatenatedIntegerTime(apiScheduleDay.opens_at);
  const closesAtTime = parseConcatenatedIntegerTime(apiScheduleDay.closes_at);
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

const parseValidAPIScheduleDays = (
  apiScheduleDays: ScheduleDay[],
): RecurringInterval[] => apiScheduleDays.reduce((acc: RecurringInterval[], apiScheduleDay) => {
  const interval = parseAPIScheduleDay(apiScheduleDay);
  if (interval) { acc.push(interval); }
  return acc;
}, []);

/** Transform API Schedule into a RecurringSchedule. */
export const parseAPISchedule = (apiSchedule: Schedule) => new RecurringSchedule({
  intervals: parseValidAPIScheduleDays(apiSchedule.schedule_days),
  hoursKnown: apiSchedule.hours_known,
});

export const parseAlgoliaSchedule = (algoliaSchedule: ScheduleDay[]) => new RecurringSchedule({
  intervals: parseValidAPIScheduleDays(algoliaSchedule),
});
