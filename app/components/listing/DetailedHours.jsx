import React from 'react';
import PropTypes from 'prop-types';
import { timeToString, sortScheduleDays } from '../../utils/index';

export default function DetailedHours(props) {
  let { schedule } = props;
  schedule = sortScheduleDays(schedule);
  const hoursList = schedule.map((item) => {
    if (item.opens_at === 0 && item.closes_at >= 2359) {
      return (
        <div key={item.id} className="weekly-hours-list--item">
          <span className="weekly-hours-list--item--day">{`${item.day}`}</span>
          <span className="weekly-hours-list--item--hours">24 Hours</span>
        </div>
      );
    }
    if (item.opens_at !== null && item.closes_at !== null) {
      return (
        <div key={item.id} className="weekly-hours-list--item">
          <span className="weekly-hours-list--item--day">{`${item.day}`}</span>
          <span className="weekly-hours-list--item--hours">{`${timeToString(item.opens_at)} - ${timeToString(item.closes_at)}`}
          </span>
        </div>
      );
    }
  });
  return (
    <span className="weekly-hours-list">
      {hoursList}
    </span>
  );
}

DetailedHours.propTypes = {
  schedule: PropTypes.arrayOf(PropTypes.shape({
    closes_at: PropTypes.number.isRequired,
    opens_at: PropTypes.number.isRequired,
    day: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
  })).isRequired,
};
