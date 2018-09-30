import React, { Component } from 'react';
import { timeToTimeInputValue, stringToTime } from '../../utils/index';
import EditScheduleDay from './EditScheduleDay';

import './EditSchedule.scss';

function buildSchedule(schedule) {
  const scheduleId = schedule ? schedule.id : null;
  const currSchedule = {};
  let finalSchedule = {};
  let currDay = '';

  const is24Hours = {
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  };

  const tempSchedule = {
    Monday: [{ opens_at: null, closes_at: null, scheduleId }],
    Tuesday: [{ opens_at: null, closes_at: null, scheduleId }],
    Wednesday: [{ opens_at: null, closes_at: null, scheduleId }],
    Thursday: [{ opens_at: null, closes_at: null, scheduleId }],
    Friday: [{ opens_at: null, closes_at: null, scheduleId }],
    Saturday: [{ opens_at: null, closes_at: null, scheduleId }],
    Sunday: [{ opens_at: null, closes_at: null, scheduleId }],
  };

  if (schedule) {
    schedule.schedule_days.forEach((curr) => {
      const schedule = curr;
      currDay = schedule.day;
      if (!is24Hours[currDay]) {
        // Check to see if any of the hour pairs for the day
        // indicate the resource/service is open 24 hours
        // if there is a pair only have that in the schedule obj
        if (schedule.opens_at === 0 && schedule.closes_at === 2359) {
          is24Hours[currDay] = true;
          // Since this record already exists in our DB, we only need the id
          // scheduleID is needed when creating no data
          currSchedule[currDay] = [{ opens_at: 0, closes_at: 2359, id: curr.id }];
        } else {
          schedule.openChanged = false;
          schedule.closeChanged = false;
          currSchedule[currDay] ? currSchedule[schedule.day].unshift(curr) : currSchedule[schedule.day] = [schedule];
        }
      }
    });
  }
  finalSchedule = Object.assign({}, tempSchedule, currSchedule);
  return finalSchedule;
}

class EditSchedule extends Component {
  constructor(props) {
    super(props);

    this.state = {
      schedule_days: {},
      scheduleId: props.schedule ? props.schedule.id : null,
      scheduleDays: buildSchedule(props.schedule),
      uuid: -1,
    };

    this.getDayHours = this.getDayHours.bind(this);
    this.handleScheduleChange = this.handleScheduleChange.bind(this);
    this.addTime = this.addTime.bind(this);
    this.removeTime = this.removeTime.bind(this);
    this.toggle24Hours = this.toggle24Hours.bind(this);
  }

  handleScheduleChange(day, index, field, value) {
    const tempDaySchedule = this.state.scheduleDays[day].map(curr => Object.assign({}, curr));
    tempDaySchedule[index][field] = stringToTime(value);
    tempDaySchedule[index][field === 'opens_at' ? 'openChanged' : 'closeChanged'] = true;
    if (!tempDaySchedule[index].id && tempDaySchedule[index].id !== null) {
      tempDaySchedule.id = null;
    }
    const tempScheduleDays = Object.assign({}, this.state.scheduleDays, { [day]: tempDaySchedule });
    this.setState({ scheduleDays: tempScheduleDays }, function () {
      this.props.handleScheduleChange(tempScheduleDays);
    });
  }

  removeTime(day, index) {
    const tempDaySchedule = this.state.scheduleDays[day].map(curr => Object.assign({}, curr));
    tempDaySchedule[index].opens_at = null;
    tempDaySchedule[index].closes_at = null;
    tempDaySchedule[index].openChanged = true;
    tempDaySchedule[index].closeChanged = true;

    if (!tempDaySchedule[index].id && tempDaySchedule[index].id !== null) {
      tempDaySchedule.id = null;
    }

    const tempScheduleDays = Object.assign({}, this.state.scheduleDays, { [day]: tempDaySchedule });
    this.setState({ scheduleDays: tempScheduleDays }, function () {
      this.props.handleScheduleChange(tempScheduleDays);
    });
  }

  addTime(day) {
    const tempDaySchedule = this.state.scheduleDays[day].map(curr => Object.assign({}, curr));
    tempDaySchedule.push({ opens_at: null, closes_at: null, scheduleId: this.state.scheduleId });
    const tempScheduleDays = Object.assign({}, this.state.scheduleDays, { [day]: tempDaySchedule });
    this.setState({ scheduleDays: tempScheduleDays }, function () {
      this.props.handleScheduleChange(tempScheduleDays);
    });
  }

  formatTime(time) {
    // FIXME: Use full times once db holds such values.
    return time.substring(0, 2);
  }

  getDayHours(day, field, index) {
    const dayRecord = this.state.scheduleDays[day] && this.state.scheduleDays[day][index];
    if (!dayRecord) {
      return null;
    }
    const time = dayRecord[field];
    return timeToTimeInputValue(time, true);
  }

  // is24Hours: indicates if the current day schedule is open 24 hours
  toggle24Hours(day, is24Hours) {
    const tempDaySchedule = Object.assign({}, this.state.scheduleDays[day][0]);

    if (!is24Hours) {
      tempDaySchedule.opens_at = 0;
      tempDaySchedule.closes_at = 2359;
    } else {
      tempDaySchedule.opens_at = null;
      tempDaySchedule.closes_at = null;
    }

    tempDaySchedule.openChanged = true;
    tempDaySchedule.closeChanged = true;
    tempDaySchedule.scheduleId = this.state.scheduleId;

    if (!tempDaySchedule.id && tempDaySchedule.id !== null) {
      tempDaySchedule.id = null;
    }

    const tempScheduleDays = Object.assign({}, this.state.scheduleDays, { [day]: [tempDaySchedule] });
    this.setState({ scheduleDays: tempScheduleDays }, function () {
      this.props.handleScheduleChange(tempScheduleDays);
    });
  }

  render() {
    const daysOfWeek = {
      Monday: 'M',
      Tuesday: 'T',
      Wednesday: 'W',
      Thursday: 'Th',
      Friday: 'F',
      Saturday: 'S',
      Sunday: 'Su',
    };

    const schedule = this.state.scheduleDays;
    return (
      <li key="hours" className="edit--section--list--item hours">
        <label>Hours</label>
        <label className="open-24-label">24 hrs?</label>
        <ul className="edit-hours-list">
          {
              Object.keys(schedule).map((day, i) => (
                <EditScheduleDay
                  day={day}
                  dayAbbrev={daysOfWeek[day]}
                  dayHours={schedule[day]}
                  key={i}
                  handleScheduleChange={this.handleScheduleChange}
                  toggle24Hours={this.toggle24Hours}
                  getDayHours={this.getDayHours}
                  addTime={this.addTime}
                  removeTime={this.removeTime}
                />
                ))
            }
        </ul>
      </li>
    );
  }
}
export default EditSchedule;
