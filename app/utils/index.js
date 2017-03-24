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

export function timeToString(time, twentyFourHour) {
  // let hoursString = "";
  // if(hours < 12) {
  //   hoursString += hours + "am";
  // } else {
  //   if(hours > 12) {
  //     hours -= 12;
  //   }
  //
  //   hoursString += hours + "pm";
  // }
  //
  // return hoursString;
  let timeString = "" + time;
  let conversionArray = timeString.split('');
  let length = conversionArray.length;
  for(let i = length; i < 4; i++) {
      conversionArray.unshift('0');
  }

  let hoursString = conversionArray[0]+conversionArray[1];
  let hours = parseInt(hoursString);
  let minutesString = conversionArray[2]+conversionArray[3];
  let timeOfDay = "am";

  if(hours > 12) {
      timeOfDay = "pm";
      hours -= 12;
  } else if(hours === 0) {
      hours = 12;
  }

  return ""+hours+":"+minutesString+timeOfDay;
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
