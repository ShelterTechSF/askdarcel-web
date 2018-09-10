import React from 'react';
import PropTypes from 'prop-types';

class TableOfOpeningTimes extends React.Component {
  render() {
    const { schedule } = this.props;

    // TODO order with current day first
    // TODO Show relativeOpeningTime for current day
    // TODO Show days without entries in the schedule as closed
    // TODO Order with current day at top
    
    return (
      <table className="compact">
        <tbody>
          { schedule.schedule_days.map(sched => (
            <tr key={sched.day}>
              <th>{ sched.day }</th>
              <td>{ sched.opens_at }-{ sched.closes_at }</td>
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
