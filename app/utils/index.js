import padStart from 'lodash/padStart';

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

export function timeToString(hours) {
  const date = new Date();
  if (hours) {
    const hoursString = hours.toString();
    date.setHours(hoursString.substring(0, hoursString.length - 2));
    date.setMinutes(hoursString.substring(hoursString.length - 2, hoursString.length));
    date.setSeconds(0);

    return date.toLocaleTimeString().replace(/:\d+ /, ' ');
  }
  return null;
}

export function formatTimeForForm(hours) {
  hours = padStart(hours, 4, '0');
  return hours.substring(0, 2) + ':' + hours.substring(2, hours.length);
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

  const days = scheduleDays.filter(scheduleDay =>
    scheduleDay &&
    scheduleDay.day.replace(/,/g, '') === daysOfTheWeek()[currentDate.getDay()] &&
    currentHour >= scheduleDay.opens_at &&
    currentHour < scheduleDay.closes_at,
  );

  if (days.length && days.length > 0) {
    for (let i = 0; i < days.length; i += 1) {
      const day = days[i];
      if (day.opens_at === 0 && day.closes_at >= 2359) {
        hours = 'Open 24 Hours';
      } else {
        hours = `Open Now: ${timeToString(day.opens_at)}-${timeToString(day.closes_at)}`;
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
