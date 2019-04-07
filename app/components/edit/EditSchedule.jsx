import React, { Component } from 'react';
import { timeToTimeInputValue, stringToTime } from '../../utils/index';
import EditScheduleDay from './EditScheduleDay';

import './EditSchedule.scss';

function buildSchedule(schedule) {
  const scheduleId = schedule ? schedule.id : null;
  const currSchedule = {};
  let finalSchedule = {};

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
    schedule.schedule_days.forEach(day => {
      const currDay = day.day;
      if (!is24Hours[currDay]) {
        // Check to see if any of the hour pairs for the day
        // indicate the resource/service is open 24 hours
        // if there is a pair only have that in the day obj
        if (day.opens_at === 0 && day.closes_at === 2359) {
          is24Hours[currDay] = true;
          // Since this record already exists in our DB, we only need the id
          // scheduleID is needed when creating no data
          currSchedule[currDay] = [{ opens_at: 0, closes_at: 2359, id: day.id }];
        } else {
          Object.assign(day, { openChanged: false, closeChanged: false });
          if (currSchedule[currDay]) {
            currSchedule[day.day].unshift(day);
          } else {
            currSchedule[day.day] = [day];
          }
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
      // ESLint can't detect that this field is actually beind used in the
      // callbacks.
      // eslint-disable-next-line react/no-unused-state
      scheduleId: props.schedule ? props.schedule.id : null,
      scheduleDays: buildSchedule(props.schedule),
    };

    this.getDayHours = this.getDayHours.bind(this);
    this.handleScheduleChange = this.handleScheduleChange.bind(this);
    this.addTime = this.addTime.bind(this);
    this.removeTime = this.removeTime.bind(this);
    this.toggle24Hours = this.toggle24Hours.bind(this);
  }

  getDayHours(day, field, index) {
    const { scheduleDays } = this.state;
    const dayRecord = scheduleDays[day] && scheduleDays[day][index];
    if (!dayRecord) {
      return null;
    }
    const time = dayRecord[field];
    return timeToTimeInputValue(time, true);
  }

  addTime(day) {
    const { handleScheduleChange } = this.props;
    let tempScheduleDays;

    this.setState(
      ({ scheduleDays, scheduleId }) => {
        const tempDaySchedule = scheduleDays[day].map(curr => Object.assign({}, curr));
        tempDaySchedule.push({ opens_at: null, closes_at: null, scheduleId });
        tempScheduleDays = Object.assign({}, scheduleDays, { [day]: tempDaySchedule });
        return { scheduleDays: tempScheduleDays };
      },
      () => {
        handleScheduleChange(tempScheduleDays);
      },
    );
  }

  removeTime(day, index) {
    const { handleScheduleChange } = this.props;
    let tempScheduleDays;

    this.setState(
      ({ scheduleDays }) => {
        const tempDaySchedule = scheduleDays[day].map(curr => Object.assign({}, curr));
        Object.assign(tempDaySchedule[index], {
          opens_at: null,
          closes_at: null,
          openChanged: true,
          closeChanged: true,
        });

        if (!tempDaySchedule[index].id && tempDaySchedule[index].id !== null) {
          tempDaySchedule.id = null;
        }

        tempScheduleDays = Object.assign({}, scheduleDays, { [day]: tempDaySchedule });
        return { scheduleDays: tempScheduleDays };
      },
      () => {
        handleScheduleChange(tempScheduleDays);
      },
    );
  }

  handleScheduleChange(day, index, field, value) {
    const { handleScheduleChange } = this.props;
    let tempScheduleDays;

    this.setState(
      ({ scheduleDays }) => {
        const tempDaySchedule = scheduleDays[day].map(curr => Object.assign({}, curr));
        tempDaySchedule[index][field] = stringToTime(value);
        const changedField = field === 'opens_at' ? 'openChanged' : 'closeChanged';
        tempDaySchedule[index][changedField] = true;
        if (!tempDaySchedule[index].id && tempDaySchedule[index].id !== null) {
          tempDaySchedule.id = null;
        }
        tempScheduleDays = Object.assign({}, scheduleDays, { [day]: tempDaySchedule });
        return { scheduleDays: tempScheduleDays };
      },
      () => {
        handleScheduleChange(tempScheduleDays);
      },
    );
  }

  // is24Hours: indicates if the current day schedule is open 24 hours
  toggle24Hours(day, is24Hours) {
    const { handleScheduleChange } = this.props;
    let tempScheduleDays;
    this.setState(
      ({ scheduleDays, scheduleId }) => {
        const tempDaySchedule = Object.assign({}, scheduleDays[day][0]);

        if (is24Hours) {
          Object.assign(tempDaySchedule, {
            opens_at: null,
            closes_at: null,
          });
        } else {
          Object.assign(tempDaySchedule, {
            opens_at: 0,
            closes_at: 2359,
          });
        }

        Object.assign(tempDaySchedule, {
          openChanged: true,
          closeChanged: true,
          scheduleId,
        });

        if (!tempDaySchedule.id && tempDaySchedule.id !== null) {
          tempDaySchedule.id = null;
        }

        tempScheduleDays = Object.assign(
          {},
          scheduleDays,
          { [day]: [tempDaySchedule] },
        );
        return { scheduleDays: tempScheduleDays };
      },
      () => {
        handleScheduleChange(tempScheduleDays);
      },
    );
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

    const { scheduleDays: schedule } = this.state;
    return (
      <li key="hours" className="edit--section--list--item hours">
        <span className="label">Hours</span>
        <span className="label open-24-label">24 hrs?</span>
        <ul className="edit-hours-list">
          {
            Object.keys(schedule).map(day => (
              <EditScheduleDay
                day={day}
                dayAbbrev={daysOfWeek[day]}
                dayHours={schedule[day]}
                key={day.id}
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
