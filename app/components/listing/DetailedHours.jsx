import React from 'react';
import PropTypes from 'prop-types';
import { RecurringSchedule } from '../../utils/RecurringSchedule';

const DetailedHours = ({ recurringSchedule }) => (
  <span className="weekly-hours-list">
    {recurringSchedule.intervals.map(interval => (
      <div key={interval.key()} className="weekly-hours-list--item">
        <span className="weekly-hours-list--item--day">{interval.opensAt.dayString()}</span>
        <span className="weekly-hours-list--item--hours">
          { interval.is24Hours()
            ? '24 Hours'
            : `${interval.opensAt.timeString()} - ${interval.closesAt.timeString()}`
          }
        </span>
      </div>
    ))}
  </span>
);

DetailedHours.propTypes = {
  recurringSchedule: PropTypes.instanceOf(RecurringSchedule).isRequired,
};

export default DetailedHours;
