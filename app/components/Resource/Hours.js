import React, { Component } from 'react';
import DetailedHours from './DetailedHours';
import { timeToString, daysOfTheWeek } from '../../utils/index';

export default class Hours extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDetailedHours: false,
    };

    this.toggleDetailedHours = this.toggleDetailedHours.bind(this);
  }

  toggleDetailedHours() {
    this.setState({ showDetailedHours: !this.state.showDetailedHours });
  }
  render() {
    let { schedule } = this.props;
    let { showDetailedHours } = this.state;

    return (
      <li className="hours">
        <i className="material-icons">schedule</i>
          <div className="current-hours" onClick={this.toggleDetailedHours}>
            {buildHoursText(schedule)}
            <span>{showDetailedHours ?
              <i className="material-icons">keyboard_arrow_up</i> :
              <i className="material-icons">keyboard_arrow_down</i>}</span>
          </div>
          <div className="weekly-hours">
            {showDetailedHours ? <DetailedHours schedule={schedule} /> : null}
          </div>
      </li>
    );
  }
}



function buildHoursText(schedule_days) {
  if(!schedule_days) {
    return;
  }

  let hours = "";
  let styles = {
    cell: true
  };
  const currentDate = new Date();
  const currentHour = currentDate.getHours();

  const days = schedule_days.filter(schedule_day => {
    return (schedule_day && schedule_day.day.replace(/,/g, '') == daysOfTheWeek()[currentDate.getDay()] &&
        currentHour >= schedule_day.opens_at && currentHour < schedule_day.closes_at);
  });



  if(days.length && days.length > 0) {
    for(let i = 0; i < days.length; i++) {
      let day = days[i];
      hours = "Open Now: " + timeToString(day.opens_at) + "-" + timeToString(day.closes_at);
      if(i != days.length - 1) {
        hours += ", ";
      }
    }
  } else {
    hours = "Closed Now";
    styles.closed = true;
  }

  return (
    <p>{hours}</p>
  );
}
