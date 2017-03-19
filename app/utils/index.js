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
  let hoursString = "";
  if(hours < 12) {
    hoursString += hours + "am";
  } else {
    if(hours > 12) {
      hours -= 12;
    }

    hoursString += hours + "pm";
  }

  return hoursString;
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