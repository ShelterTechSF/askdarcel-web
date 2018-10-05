import React, { Component } from 'react';
import { buildHoursText } from '../../utils';

export default class Hours extends Component {
  render() {
    const { schedule } = this.props;
    return (
      <span className="hours">
        <p>{buildHoursText(schedule)}</p>
      </span>
    );
  }
}
