import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { timeToTimeInputValue } from '../../utils/index';

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
  buildTimeInput(day, index, curr, is24Hours) {
    // This checks if a time for a day was deleted, and skips rendering if it was
    if (index > 0 && curr.opens_at === null
     && curr.closes_at === null
     && curr.openChanged === true
     && curr.closeChanged === true) {
      return null;
    }
    const { handleScheduleChange, removeTime } = this.props;
    const abbrev = DAYS_OF_WEEK[day];
    return (
      <li key={index}>
        <p>{ index === 0 && abbrev }</p>
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
                value={timeToTimeInputValue(curr.opens_at)}
                onChange={e => handleScheduleChange(day, index, 'opens_at', e.target.value)}
              />
              <input
                type="time"
                value={timeToTimeInputValue(curr.closes_at)}
                onChange={e => handleScheduleChange(day, index, 'closes_at', e.target.value)}
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeTime(day, index)}
                  className="remove-time icon-button"
                >
                  <i className="material-icons">delete</i>
                </button>
              )}
            </div>
          )
        }
      </li>
    );
  }

  render() {
    const {
      day, addTime, dayHours, toggle24Hours,
    } = this.props;
    let is24Hours = false;

    if (dayHours[0].opens_at === 0 && dayHours[0].closes_at === 2359) {
      is24Hours = true;
    }

    return (
      <div className="day-group">
        <div className="hours">
          {
            dayHours.map((curr, i) => (
              this.buildTimeInput(day, i, curr, is24Hours)
            ))
          }
        </div>
        <div className="add-time">
          {!is24Hours && (
            <button type="button" className="icon-button" onClick={() => addTime(day)}>
              <i className="material-icons">add</i>
            </button>
          )}
        </div>
        <div className="is-24-hours">
          <input
            type="checkbox"
            checked={is24Hours}
            onChange={() => toggle24Hours(day, is24Hours)}
          />
        </div>
      </div>
    );
  }
}

EditScheduleDay.propTypes = {
  dayHours: PropTypes.arrayOf(PropTypes.shape({
    closes_at: PropTypes.number,
    opens_at: PropTypes.number,
  })).isRequired,
  addTime: PropTypes.func.isRequired,
  toggle24Hours: PropTypes.func.isRequired,
  removeTime: PropTypes.func.isRequired,
  handleScheduleChange: PropTypes.func.isRequired,
  day: PropTypes.string.isRequired,
};

export default EditScheduleDay;
