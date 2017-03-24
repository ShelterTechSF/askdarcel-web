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
  let timeString = "" + time;
  let conversionArray = timeString.split('');
  let length = conversionArray.length;
  for(let i = length; i < 4; i++) {
      conversionArray.unshift('0');
  }

  let hoursString = conversionArray[0]+conversionArray[1];
  let hours = parseInt(hoursString);
  let minutesString = conversionArray[2]+conversionArray[3];
  let timeOfDay = "";

  if(!twentyFourHour) {
      if(hours > 12) {
          timeOfDay = "pm";
          hours -= 12;
      } else if(hours === 0) {
          timeOfDay = "am";
          hours = 12;
      } else {
          timeOfDay = "am";
      }

      hoursString = "" + hours;
  }

  return ""+hoursString+":"+minutesString+timeOfDay;
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
