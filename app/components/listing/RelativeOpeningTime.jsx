import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

// TODO Until we use actual timestamps, this one constant converts everything to the correct timezone
const timezoneOffset = new Date().getTimezoneOffset() / 60;

export class RelativeOpeningTime extends React.Component {
  static parseAsDate(fourOrThreeDigitNumber) {
    const fourDigitNumber = `0000000${fourOrThreeDigitNumber}`.slice(-4);
    const hour = (Number(`${fourDigitNumber}`.slice(0, 2)) + timezoneOffset) * 1000 * 60 * 60;
    const mins = Number(`${fourDigitNumber}`.slice(2, 4)) * 1000 * 60;
    // console.log(fourOrThreeDigitNumber, '->', fourDigitNumber, '->', [hour, mins]);
    return new Date(hour + mins);
  }

  // Turns a schedule day into an exact date/timestamp for the next relevant day from now
  static convertScheduleDayToOpenCloseTimestamps(schedule_day, currentDate = moment()) {
    const today = currentDate.clone().day();
    const daysOfWeek = RelativeOpeningTime.daysOfWeek.slice();
    const todayAndAfter = daysOfWeek.splice(today);
    const orderedDaysOfTheWeek = todayAndAfter.concat(daysOfWeek);

    const daysFromToday = orderedDaysOfTheWeek.indexOf(schedule_day.day);
    const openingTime = RelativeOpeningTime.parseAsDate(schedule_day.opens_at);
    const closingTime = RelativeOpeningTime.parseAsDate(schedule_day.closes_at);

    const opens_at = currentDate
      .clone()
      .add(daysFromToday, 'days')
      .startOf('day')
      .add(openingTime.getHours(), 'hours')
      .add(openingTime.getMinutes(), 'minutes');

    const closes_at = currentDate
      .clone()
      .add(daysFromToday + (schedule_day.opens_at > schedule_day.closes_at ? 1 : 0), 'days') // If the close is before the open, add a day
      .startOf('day')
      .add(closingTime.getHours(), 'hours')
      .add(closingTime.getMinutes(), 'minutes');

    // console.log({
    //   str: `${schedule_day.day}:${schedule_day.opens_at}->${schedule_day.closes_at} = ${opens_at.format('LLLL')} -> ${closes_at.format('LLLL')}`,
    //   today,
    //   opens_at,
    //   closes_at,
    //   schedule_day,
    //   daysFromToday,
    //   openingTime,
    //   closingTime,
    //   currentDate,
    //   orderedDaysOfTheWeek,
    // });

    return { opens_at, closes_at };
  }

  static parseSchedule(schedule_days, currentDate = moment()) {
    if (!schedule_days) return { text: '', classes: '' };

    const schedule = schedule_days.map(schedule_day => RelativeOpeningTime.convertScheduleDayToOpenCloseTimestamps(schedule_day, currentDate));

    const STATUS_CLOSED = 'status-red';
    const STATUS_OPEN = 'status-green';
    const STATUS_CAUTION = 'status-amber';
    const currentDay = currentDate.day();
    const tomorrowDay = currentDate.clone().add(1, 'day').day();

    const todayHours = schedule.filter(hours => hours.opens_at.day() === currentDay);
    const tomorrowHours = schedule.filter(hours => hours.opens_at.day() === tomorrowDay);
    const daysOpen24Hours = schedule_days.filter(hours => hours.opens_at === 0 && hours.closes_at === 2359);
    if (todayHours.length === 0) return { text: 'Closed Today', classes: STATUS_CLOSED };
    if (daysOpen24Hours.length === 7) return { text: 'Open 24/7', classes: STATUS_OPEN };

    for (const hours of todayHours) {
      if (hours.opens_at.hours() === 0 && hours.opens_at.minutes() === 0 && hours.closes_at.hours() === 23 && hours.closes_at.minutes() === 59) return { text: 'Open 24h today', classes: STATUS_OPEN };
      if (currentDate.isAfter(hours.opens_at) && currentDate.isBefore(hours.closes_at)) {
        const minutesUntilClosing = Math.ceil(hours.closes_at.diff(currentDate) / 1000 / 60);
        if (minutesUntilClosing <= 30) return { text: `Closes in ${minutesUntilClosing} mins`, classes: STATUS_CAUTION };
        return { text: 'Open Now', classes: STATUS_OPEN };
      }

      const minutesUntilOpening = Math.abs(Math.ceil(currentDate.diff(hours.opens_at) / 1000 / 60));
      if (minutesUntilOpening < 30) return { text: `Opens in ${minutesUntilOpening} mins`, classes: STATUS_CAUTION };
    }

    if (tomorrowHours.length) {
      // TODO Not sure the below helps UX at all, can readd later
      // const firstOpens = moment.min(tomorrowHours.map(sched => sched.opens_at));
      // return { text: `Closed till ${firstOpens.format('LT')} tomorrow`, classes: STATUS_CLOSED };
      return { text: 'Closed Until Tomorrow', classes: STATUS_CLOSED };
    }

    return { text: 'Closed Now', classes: STATUS_CLOSED };
  }

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
    const { text, classes } = RelativeOpeningTime.parseSchedule(this.props.schedule.schedule_days, this.props.currentDate);
    return (
      <span className={`relative-opening-time ${classes}`}>
        { text }
      </span>
    );
  }
}

RelativeOpeningTime.daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

RelativeOpeningTime.propTypes = {
  schedule: PropTypes.object.isRequired,
  currentDate: PropTypes.object,
};

RelativeOpeningTime.defaultProps = {
  currentDate: moment(),
};
