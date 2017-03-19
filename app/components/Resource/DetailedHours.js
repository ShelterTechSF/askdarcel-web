import React, { Component } from 'react';
import { timeToString, daysOfTheWeek } from '../../utils/index';

export default class DetailedHours extends Component {
  render() {
    let { schedule } = this.props;
    let hoursList = schedule.map((item,i) => 
      <div key={i}>{`${item.day}: ${timeToString(item.opens_at)} - ${timeToString(item.closes_at)}`}</div>
    );

    return (
      <div>
        {hoursList}
      </div>
    );
  }
}

