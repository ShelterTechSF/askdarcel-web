import React, { Component } from 'react';
import _ from 'lodash';
import { stringToTime } from '../../utils/index';
import EditScheduleDay from './EditScheduleDay';
import { buildScheduleDays } from '../../pages/OrganizationEditPage';

import './EditSchedule.scss';

class EditSchedule extends Component {
  constructor(props) {
    super(props);
    const { canInheritFromParent } = props;

    this.state = {
      // ESLint can't detect that this field is actually beind used in the
      // callbacks.
      // eslint-disable-next-line react/no-unused-state
      scheduleId: props.schedule ? props.schedule.id : null,
      scheduleDays: buildScheduleDays(props.schedule),
      // If the service doesn't have a schedule associated with it, and can
      // inherit its schedule from its parent, inherit the parent resource's schedule.
      shouldInheritSchedule: canInheritFromParent && !(_.get(props, 'schedule.schedule_days.length', false)),
    };

    this.handleScheduleChange = this.handleScheduleChange.bind(this);
    this.addTime = this.addTime.bind(this);
    this.removeTime = this.removeTime.bind(this);
    this.toggle24Hours = this.toggle24Hours.bind(this);
    this.toggleInheritSchedule = this.toggleInheritSchedule.bind(this);
  }

  toggleInheritSchedule(e) {
    const { handleScheduleChange, schedule } = this.props;
    const shouldInheritSchedule = e.target.checked;

    let tempScheduleDays = {};
    this.setState(
      ({ scheduleDays }) => {
        tempScheduleDays = { ...scheduleDays };

        // Services without explicit schedules automatically inherit their
        // schedule from their parent resource. So, by completely wiping out
        // the service schedule, the service will fall back to inheriting its
        // parent's schedule.
        //
        // Go through each schedule day item and set the open/close times to null
        // and the dirty state to true in order to completely wipe the schedule
        // on save.
        if (shouldInheritSchedule) {
          Object.keys(scheduleDays).forEach(day => {
            const tempDaySchedule = scheduleDays[day].map(curr => ({
              ...curr,
              opens_at: null,
              closes_at: null,
              openChanged: true,
              closeChanged: true,
            }));
            tempScheduleDays[day] = tempDaySchedule;
          });
        } else {
          tempScheduleDays = buildScheduleDays(schedule);
        }

        return { scheduleDays: tempScheduleDays, shouldInheritSchedule };
      },
      () => {
        handleScheduleChange(tempScheduleDays);
      },
    );
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
    const { scheduleDays: schedule, shouldInheritSchedule } = this.state;
    // This component is shared between organizations and services. Organizations
    // are top level, and cannot inherit schedules. OTOH Services can inherit
    // their schedule from their parent organization. This prop controls this
    // difference in behavior.
    const { canInheritFromParent } = this.props;
    return (
      <li key="hours" className="edit--section--list--item hours">
        <span className="label">Hours</span>
        { canInheritFromParent
          && (
            <div className="inherit-schedule">
              <input
                id="inherit"
                type="checkbox"
                checked={shouldInheritSchedule}
                onChange={this.toggleInheritSchedule}
              />
              <label htmlFor="inherit">Inherit schedule from parent organization</label>
            </div>
          )
        }
        {!shouldInheritSchedule && (
          <div>
            <span className="label open-24-label">24 hrs?</span>
            <ul className="edit-hours-list">
              {
                Object.keys(schedule).map(day => (
                  <EditScheduleDay
                    key={day}
                    day={day}
                    dayHours={schedule[day]}
                    handleScheduleChange={this.handleScheduleChange}
                    toggle24Hours={this.toggle24Hours}
                    addTime={this.addTime}
                    removeTime={this.removeTime}
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
export default EditSchedule;
