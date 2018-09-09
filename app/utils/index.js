import moment from 'moment';

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

export function getWalkTime(currLocation, dest, cb) {
  const directionsService = new google.maps.DirectionsService();
  const myLatLng = new google.maps.LatLng(currLocation.lat, currLocation.lng);
  const destLatLang = new google.maps.LatLng(dest.lat, dest.lng);
  const preferences = {
    origin: myLatLng,
    destination: destLatLang,
    travelMode: google.maps.TravelMode.WALKING,
  };
  directionsService.route(preferences, (result, status) => {
    if (status === google.maps.DirectionsStatus.OK) {
      cb(result.routes[0].legs[0].duration.text);
    }
  });
}


export function getTimes(scheduleDays) {
  const currentDate = new Date();
  const yesterday = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 1);

  const currentTime = parseInt(moment().format('hhmm'), 10);
  let openUntil = null;
  // Logic to determine if the current resource is open
  // includes special logic for when a resource is open past midnight
  // on the previous day
  // eslint-disable-next-line
  scheduleDays && scheduleDays.forEach((scheduleDay) => {
    const day = scheduleDay ? scheduleDay.day.replace(/,/g, '') : null;
    const opensAt = scheduleDay.opens_at;
    const closesAt = scheduleDay.closes_at;

    if (day) {
      if (day === daysOfTheWeek()[currentDate.getDay()]) {
        if (currentTime > opensAt && currentTime < closesAt) {
          openUntil = closesAt;
        }
      }

      if (day === daysOfTheWeek()[yesterday.getDay()] && closesAt < opensAt) {
        if (currentTime < closesAt) {
          openUntil = closesAt;
        }
      }
    }
  });

  if (openUntil) {
    if (openUntil === 2359) {
      return { openUntil, isOpen: true, is24hour: true };
    }
    return { openUntil, isOpen: true };
  }
  return { openUntil, isOpen: false };
}
