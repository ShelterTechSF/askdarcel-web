import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const dayMapping = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 7,
};

class TableOfOpeningTimes extends React.Component {
  parseTime(time) {
    const str = '0000' + time;
    const t = new moment(str.slice(-4), 'HHmm');
    return t.format('h:mma');
  }

  render() {
    const { schedule } = this.props;

    const days = schedule.schedule_days
      .sort((a, b) => dayMapping[a.day] > dayMapping[b.day])

    // TODO order with current day first
    // TODO Show relativeOpeningTime for current day
    // TODO Show days without entries in the schedule as closed
    // TODO Order with current day at top
    
    return (
      <table className="compact">
        <tbody>
          { days.map(sched => (
            <tr key={sched.day}>
              <th>{ sched.day }</th>
              <td>{ this.parseTime(sched.opens_at) } - { this.parseTime(sched.closes_at) }</td>
            </tr>
          )) }
        </tbody>
      </table>
    );
  }
}

TableOfOpeningTimes.propTypes = {
  schedule: PropTypes.object,
};

TableOfOpeningTimes.defaultProps = {
  schedule: {},
};

export default TableOfOpeningTimes;
