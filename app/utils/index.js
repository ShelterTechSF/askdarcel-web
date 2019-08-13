import moment from 'moment';

export function getAuthRequestHeaders() {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
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
    return '';
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

/**
 * Round numbers to a specified decimal place.
 *
 * E.g.
 * round(-122.312360, 4) -> -122.3124
 * round(33.102938, 2) -> -33.10
 */
export function round(value, decimals) {
  return Number(`${Math.round(`${value}e${decimals}`)}e-${decimals}`);
}

export function getCurrentDayTime() {
  const mmt = moment();
  const day = mmt.day();
  const mmtMidnight = mmt.clone().startOf('day');
  const diffMinutes = mmt.diff(mmtMidnight, 'minutes');
  // Round down to the closest 30 min block of time
  const timeRoundedDown = Math.floor(diffMinutes / 30) * 30;
  const finalTime = mmt.startOf('day').add(timeRoundedDown, 'minutes').format('HH:mm');

  let dayText = '';

  switch (day) {
  case 0:
    dayText = 'Su';
    break;
  case 1:
    dayText = 'M';
    break;
  case 2:
    dayText = 'Tu';
    break;
  case 3:
    dayText = 'W';
    break;
  case 4:
    dayText = 'Th';
    break;
  case 5:
    dayText = 'F';
    break;
  case 6:
    dayText = 'Sa';
    break;
  default:
    dayText = 'Su';
  }

  const dayTime = `${dayText}-${finalTime}`;
  return dayTime;
}
