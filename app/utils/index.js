export function getAuthRequestHeaders() {
  const authHeaders = JSON.parse(localStorage.authHeaders);
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'access-token': authHeaders['access-token'],
    client: authHeaders.client,
    uid: authHeaders.uid,
  };
}

/**
 * Convert time from concatenated hours-minutes format to a Date object.
 *
 * E.g.
 * '700' to new Date(..., ..., ..., 7, 0)
 * '1330' to new Date(..., ..., ..., 13, 30)
 */
export function timeToDate(hours) {
  if (hours === null) {
    return null;
  }
  const date = new Date();
  const hoursString = hours.toString();
  date.setHours(hoursString.substring(0, hoursString.length - 2));
  date.setMinutes(hoursString.substring(hoursString.length - 2, hoursString.length));
  date.setSeconds(0);
  return date;
}

/**
 * Convert time from concatenated hours-minutes format to HH:MM P
 *
 * E.g.
 * '700' to '7:00 AM'
 * '1330' to '1:30 PM'
 */
export function timeToString(hours) {
  const date = timeToDate(hours);
  if (date === null) {
    return null;
  }
  return date.toLocaleTimeString().replace(/:\d+ /, ' ');
}

/**
 * Convert time from concatenated hours-minutes format to <input type="time">
 * format.
 *
 * A "time" <input> value should be formatted as an RFC3339 partial-time,
 * according to
 * http://w3c.github.io/html-reference/input.time.html#input.time.attrs.value
 *
 * E.g.
 * '700' to '7:00'
 * '1330' to '13:30'
 */
export function timeToTimeInputValue(hours) {
  const date = timeToDate(hours);
  if (date === null) {
    return null;
  }
  const hour = date.getHours();
  const strHour = (hour < 10) ? `0${hour.toString()}` : hour.toString();
  const minute = date.getMinutes();
  const strMinute = (minute < 10) ? `0${minute.toString()}` : minute.toString();
  return `${strHour}:${strMinute}`;
}

export function stringToTime(timeString) {
  return parseInt(timeString.replace(':', ''), 10);
}

export function daysOfTheWeek() {
  return [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
}

export function createTemplateSchedule() {
  const daysTemplate = [];
  for (let i = 0; i < daysOfTheWeek().length; i += 1) {
    const day = daysOfTheWeek()[i];
    daysTemplate.push({
      day,
      opens_at: null,
      closes_at: null,
      id: i + 1,
    });
  }

  return daysTemplate;
}

export function buildHoursText(scheduleDays) {
  if (!scheduleDays) {
    return '';
  }

  let hours = '';
  const styles = {
    cell: true,
  };
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const currentMinutes = currentDate.getMinutes();
  const currentTime = (currentHour * 100) + currentMinutes;

  const days = scheduleDays.filter(scheduleDay =>
    scheduleDay &&
    scheduleDay.day.replace(/,/g, '') === daysOfTheWeek()[currentDate.getDay()] &&
    currentTime >= scheduleDay.opens_at &&
    currentTime < scheduleDay.closes_at,
  );

  if (days.length && days.length > 0) {
    for (let i = 0; i < days.length; i += 1) {
      const day = days[i];
      if (day.opens_at === 0 && day.closes_at >= 2359) {
        hours = 'Open 24 Hours';
      } else {
        const openStr = timeToString(day.opens_at);
        const closeStr = timeToString(day.closes_at);
        hours = `Open Now: ${openStr.slice(0, openStr.length - 3)}-${closeStr.slice(0, closeStr.length - 3)}`;
      }
      if (i !== days.length - 1) {
        hours += ', ';
      }
    }
  } else {
    hours = 'Closed Now';
    styles.closed = true;
  }

  return hours;
}

export function sortScheduleDays(scheduleDays) {
  const days = daysOfTheWeek();
  return scheduleDays.sort((a, b) => (
    a.day !== b.day ? days.indexOf(a.day) - days.indexOf(b.day) : a.opens_at - b.opens_at
  ));
}
