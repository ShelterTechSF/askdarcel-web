import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditScheduleDay from './EditScheduleDay';

import './EditSchedule.scss';

class EditSchedule extends Component {
  setScheduleDaysForDay = (day, scheduleDays) => {
    const { handleScheduleChange, scheduleDaysByDay } = this.props;
    handleScheduleChange({
      ...scheduleDaysByDay,
      [day]: scheduleDays,
    });
  }

  render() {
    // This component is shared between organizations and services. Organizations
    // are top level, and cannot inherit schedules. OTOH Services can inherit
    // their schedule from their parent organization. This prop controls this
    // difference in behavior.
    const {
      canInheritFromParent,
      scheduleDaysByDay,
      scheduleId,
      setShouldInheritFromParent,
      shouldInheritFromParent,
    } = this.props;
    return (
      <li key="hours" className="edit--section--list--item hours">
        <span className="label">Hours</span>
        { canInheritFromParent
          && (
            <div className="inherit-schedule">
              <label htmlFor="inherit" className="inline-checkbox">
                <input
                  id="inherit"
                  className="input-checkbox"
                  type="checkbox"
                  checked={shouldInheritFromParent}
                  onChange={() => setShouldInheritFromParent(!shouldInheritFromParent)}
                />
                Inherit schedule from parent organization
              </label>
            </div>
          )
        }
        {!shouldInheritFromParent && (
          <div>
            <span className="label open-24-label">24 hrs?</span>
            <ul className="edit-hours-list">
              {
                Object.entries(scheduleDaysByDay).map(([day, scheduleDays]) => (
                  <EditScheduleDay
                    key={day}
                    day={day}
                    scheduleId={scheduleId}
                    scheduleDays={scheduleDays}
                    setScheduleDays={
                      newScheduleDays => this.setScheduleDaysForDay(day, newScheduleDays)
                    }
                  />
                ))
              }
            </ul>
          </div>
        )}
      </li>
    );
  }
}

EditSchedule.propTypes = {
  scheduleDaysByDay: PropTypes.object.isRequired,
  canInheritFromParent: PropTypes.bool.isRequired,
  shouldInheritFromParent: PropTypes.bool.isRequired,
  setShouldInheritFromParent: PropTypes.func,
  handleScheduleChange: PropTypes.func.isRequired,
  scheduleId: PropTypes.number,
};

EditSchedule.defaultProps = {
  setShouldInheritFromParent: null,
  scheduleId: null,
};

export default EditSchedule;
