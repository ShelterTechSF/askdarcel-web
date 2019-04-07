import React, { Component } from 'react';
import PropTypes from 'prop-types';

class EditScheduleDay extends Component {
  buildTimeInput(day, index, abbrev, curr, is24Hours) {
    // This checks if a time for a day was deleted, and skips rendering if it was
    if (index > 0 && curr.opens_at === null
     && curr.closes_at === null
     && curr.openChanged === true
     && curr.closeChanged === true) {
      return null;
    }
    const { getDayHours, handleScheduleChange, removeTime } = this.props;
    return (
      <li key={index}>
        <p>{ index === 0 ? abbrev : '' }</p>
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
                defaultValue={getDayHours(day, 'opens_at', index)}
                data-key={day}
                data-field="opens_at"
                onChange={e => handleScheduleChange(day, index, 'opens_at', e.target.value)}
              />
              <input
                type="time"
                defaultValue={getDayHours(day, 'closes_at', index)}
                data-key={day}
                data-field="closes_at"
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
      addTime, dayHours, dayAbbrev, toggle24Hours,
    } = this.props;
    const { day } = this.props;
    let is24Hours = false;

    if (dayHours[0].opens_at === 0 && dayHours[0].closes_at === 2359) {
      is24Hours = true;
    }

    return (
      <div className="day-group">
        <div className="hours">
          {
            dayHours.map((curr, i) => (
              this.buildTimeInput(day, i, dayAbbrev, curr, is24Hours)
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
  getDayHours: PropTypes.func.isRequired,
  toggle24Hours: PropTypes.func.isRequired,
  removeTime: PropTypes.func.isRequired,
  handleScheduleChange: PropTypes.func.isRequired,
  dayAbbrev: PropTypes.string.isRequired,
  day: PropTypes.string.isRequired,

};

export default EditScheduleDay;
