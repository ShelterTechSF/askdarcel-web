import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { stringToTime, timeToTimeInputValue } from '../../utils/time';

const TimeInputRow = ({
  dayOfWeekAbbrev, index, scheduleDay, is24Hours, setScheduleDay,
}) => {
  const removeTime = () => {
    const newScheduleDay = {
      ...scheduleDay,
      opens_at: null,
      closes_at: null,
      openChanged: true,
      closeChanged: true,
    };
    if (!scheduleDay.id && scheduleDay.id !== null) {
      newScheduleDay.id = null;
    }

    setScheduleDay(newScheduleDay);
  };

  const changeOpenOrCloseTime = (field, value) => {
    const parsedTime = stringToTime(value);
    const changedField = field === 'opens_at' ? 'openChanged' : 'closeChanged';
    const newScheduleDay = {
      ...scheduleDay,
      [field]: parsedTime,
      [changedField]: true,
    };
    if (!scheduleDay.id && scheduleDay.id !== null) {
      newScheduleDay.id = null;
    }

    setScheduleDay(newScheduleDay);
  };
  // This checks if a time for a day was deleted, and skips rendering if it was
  if (index > 0 && scheduleDay.opens_at === null
     && scheduleDay.closes_at === null
     && scheduleDay.openChanged === true
     && scheduleDay.closeChanged === true) {
    return null;
  }
  return (
    <li key={index}>
      <p>{ index === 0 && dayOfWeekAbbrev }</p>
      {is24Hours
        ? (
          <div>
            <p className="open-24-hours">Open 24 hours</p>
          </div>
        )
        : (
          <div>
            <input
              type="time"
              value={timeToTimeInputValue(scheduleDay.opens_at)}
              onChange={e => changeOpenOrCloseTime('opens_at', e.target.value)}
            />
            <input
              type="time"
              value={timeToTimeInputValue(scheduleDay.closes_at)}
              onChange={e => changeOpenOrCloseTime('closes_at', e.target.value)}
            />
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeTime()}
                className="remove-time icon-button"
              >
                <i className="material-icons">delete</i>
              </button>
            )}
          </div>
        )}
    </li>
  );
};

const DAYS_OF_WEEK = Object.freeze({
  Monday: 'M',
  Tuesday: 'T',
  Wednesday: 'W',
  Thursday: 'Th',
  Friday: 'F',
  Saturday: 'S',
  Sunday: 'Su',
});

class EditScheduleDay extends Component {
  setScheduleDayForIndex = (index, scheduleDay) => {
    const { scheduleDays, setScheduleDays } = this.props;
    const newScheduleDays = [
      ...scheduleDays.slice(0, index),
      scheduleDay,
      ...scheduleDays.slice(index + 1),
    ];
    setScheduleDays(newScheduleDays);
  }

  addTime = () => {
    const { scheduleDays, scheduleId, setScheduleDays } = this.props;
    const tempDaySchedule = [
      ...scheduleDays,
      { opens_at: null, closes_at: null, scheduleId },
    ];
    setScheduleDays(tempDaySchedule);
  }

  setIs24Hours = is24Hours => {
    const { scheduleId, scheduleDays, setScheduleDays } = this.props;

    const oldScheduleDay = scheduleDays[0];
    const newScheduleDay = {
      ...oldScheduleDay,
      ...(is24Hours ? {
        opens_at: 0,
        closes_at: 2359,
      } : {
        opens_at: null,
        closes_at: null,
      }),
      ...{
        openChanged: true,
        closeChanged: true,
        scheduleId,
      },
    };
    const remainingScheduleDays = is24Hours
      ? scheduleDays.slice(1).map(sd => ({
        ...sd,
        opens_at: null,
        closes_at: null,
        openChanged: true,
        closeChanged: true,
      }))
      : [];
    if (!oldScheduleDay.id && oldScheduleDay.id !== null) {
      newScheduleDay.id = null;
    }
    setScheduleDays([newScheduleDay, ...remainingScheduleDays]);
  }

  render() {
    const {
      day, scheduleDays,
    } = this.props;
    let is24Hours = false;

    if (scheduleDays[0].opens_at === 0 && scheduleDays[0].closes_at === 2359) {
      is24Hours = true;
    }

    return (
      <div className="day-group">
        <div className="hours">
          {
            scheduleDays.map((scheduleDay, index) => (
              <TimeInputRow
                key={index /* eslint-disable-line react/no-array-index-key */}
                dayOfWeekAbbrev={DAYS_OF_WEEK[day]}
                index={index}
                scheduleDay={scheduleDay}
                is24Hours={is24Hours}
                setScheduleDay={
                  newScheduleDay => this.setScheduleDayForIndex(index, newScheduleDay)
                }
              />
            ))
          }
        </div>
        <div className="add-time">
          {!is24Hours && (
            <button type="button" className="icon-button" onClick={this.addTime}>
              <i className="material-icons">add</i>
            </button>
          )}
        </div>
        <div className="is-24-hours">
          <input
            type="checkbox"
            checked={is24Hours}
            onChange={() => this.setIs24Hours(!is24Hours)}
          />
        </div>
      </div>
    );
  }
}

EditScheduleDay.propTypes = {
  scheduleDays: PropTypes.arrayOf(PropTypes.shape({
    closes_at: PropTypes.number,
    opens_at: PropTypes.number,
  })).isRequired,
  day: PropTypes.string.isRequired,
  setScheduleDays: PropTypes.func.isRequired,
};

export default EditScheduleDay;
