/**
 * Helper functions for transforming data from the API into easier to use data
 * structures.
 */
import {
  DAY_TO_INT, DAYS_IN_WEEK, MINUTES_IN_HOUR, RecurringTime, RecurringSchedule, RecurringInterval,
} from './RecurringSchedule';

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
const parseConcatenatedIntegerTime = integerTime => {
  // This algorithm is super hacky and slow, as it uses strings to separate the
  // hours digits from the minutes digits.
  const timeString = integerTime.toString();
  const hourString = timeString.substring(0, timeString.length - 2);
  const minuteString = timeString.substring(timeString.length - 2, timeString.length);
  const hour = hourString.length ? parseInt(hourString, 10) : 0;
  const minute = parseInt(minuteString, 10);
  return { hour, minute };
};

/** Transform API ScheduleDay into a RecurringInterval. */
const parseAPIScheduleDay = apiScheduleDay => {
  const opensAtTime = parseConcatenatedIntegerTime(apiScheduleDay.opens_at);
  const closesAtTime = parseConcatenatedIntegerTime(apiScheduleDay.closes_at);
  if (opensAtTime === null || closesAtTime === null) {
    console.log(`ScheduleDay has null times: ${apiScheduleDay}`);
    return null;
  }

  const opensAtMinutes = opensAtTime.hours * MINUTES_IN_HOUR + opensAtTime.minute;
  const closesAtMinutes = closesAtTime.hours * MINUTES_IN_HOUR + closesAtTime.minute;
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
export const parseAPISchedule = apiSchedule => new RecurringSchedule({
  intervals: apiSchedule.schedule_days
    .map(apiScheduleDay => parseAPIScheduleDay(apiScheduleDay))
    .filter(interval => interval),
});

export const parseAlgoliaSchedule = algoliaSchedule => new RecurringSchedule({
  intervals: algoliaSchedule.map(parseAPIScheduleDay).filter(interval => interval),
});
