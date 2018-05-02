import React from 'react';
import PropTypes from 'prop-types';
import { buildHoursText } from '../../utils';

class RelativeOpeningTime extends React.Component {
  constructor(...args) {
    super(...args);
    this.tick = null;
    this.state = {};
  }

  componentWillMount() {
    this.tick = setInterval(() => this.setState(this.state), 60000);
  }

  componentWillUnmount() {
    clearInterval(this.tick);
  }

  render() {
    const classes = 'relativeTime';
    const text = buildHoursText(this.props.schedule.schedule_days);

    return (
      <span className={classes}>
        { text }
      </span>
    );
  }
}

RelativeOpeningTime.propTypes = {
  schedule: PropTypes.object.isRequired,
};

export default RelativeOpeningTime;
