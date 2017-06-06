export function getAuthRequestHeaders() {
  let authHeaders = JSON.parse(localStorage.authHeaders);
  return {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "access-token": authHeaders['access-token'],
        "client": authHeaders.client,
        "uid": authHeaders.uid
      };
}

export function timeToString(hours) {
  let date = new Date();
  if (hours) {
    let hoursString = hours.toString();
    date.setHours(hoursString.substring(0,hoursString.length - 2));
    date.setMinutes(hoursString.substring(hoursString.length - 2,hoursString.length));
    date.setSeconds(0)

    let timeString = date.toLocaleTimeString().replace(/:\d+ /, ' ');
    return timeString;
  }
  return null;
}

export function stringToTime(timeString, twentyFourHour) {
    return parseInt(timeString.replace(":", ""));
}

export function daysOfTheWeek() {
  return [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
}

export function createTemplateSchedule() {
    let daysTemplate = [];
    for(let i = 0; i < daysOfTheWeek().length; i++) {
        let day = daysOfTheWeek()[i];
        daysTemplate.push({
            day: day,
            opens_at: null,
            closes_at: null
        });
    }

    return daysTemplate;
}

export function buildHoursText(schedule_days) {
  if(!schedule_days) {
    return;
  }

  let hours = "";
  let styles = {
    cell: true
  };
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const currentMinutes = currentDate.getMinutes();

  const currentTime = (currentHour * 100) + currentMinutes;

  const days = schedule_days.filter(schedule_day => {
    return (schedule_day && schedule_day.day.replace(/,/g, '') == daysOfTheWeek()[currentDate.getDay()] &&
    currentTime >= schedule_day.opens_at && currentTime < schedule_day.closes_at);
  });



  if(days.length && days.length > 0) {
    for(let i = 0; i < days.length; i++) {
      let day = days[i];
      if(day.opens_at == 0 && day.closes_at >= 2359) {
        hours = "Open 24 Hours";
      } else {
        hours = "Open Now: " + timeToString(day.opens_at) + "-" + timeToString(day.closes_at);
      }
      if(i != days.length - 1) {
        hours += ", ";
      }
    }
  } else {
    hours = "Closed Now";
    styles.closed = true;
  }

  return hours;
}

export function sortScheduleDays(schedule_days) {
  let days = daysOfTheWeek();
  return schedule_days.sort(function(a, b) {
      return a.day != b.day ? days.indexOf(a.day) - days.indexOf(b.day) : a.opens_at - b.opens_at;
  });
}
