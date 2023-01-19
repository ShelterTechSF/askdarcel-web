import React from 'react';
import moment from 'moment';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { RelativeOpeningTime } from '../RelativeOpeningTime';
import {
  simpleScheduleLookup,
  createScheduleFromShorthand,
} from '../../../pages/debug/ListingDemoPage';

// Note: The skipped tests are tests that are preventing a hack that allows the
// times to work during Daylight Savings, since these tests run in UTC but the
// actual code is running in the user's browser, which may be during Daylight
// Savings.

describe('<RelativeOpeningTimes />', () => {
  const getNamedSchedule = (name: keyof typeof simpleScheduleLookup) =>
    createScheduleFromShorthand([simpleScheduleLookup[name]])[0];

  it('should display "open 24/7" for a schedule with every day open', () => {
    const recurringSchedule = getNamedSchedule('twenty_four_seven');
    const comp = shallow(
      <RelativeOpeningTime recurringSchedule={recurringSchedule} />
    );
    expect(comp.find('.relative-opening-time').text()).to.equal('Open 24/7');
    expect(comp.find('.relative-opening-time').hasClass('status-green')).to.be
      .true;
  });

  it('should display "Open 24h today" for a schedule with 0-2359 today and less than 7 days open 24/7', () => {
    const recurringSchedule = getNamedSchedule('twenty_four_hours_today');
    const comp = shallow(
      <RelativeOpeningTime recurringSchedule={recurringSchedule} />
    );
    expect(comp.find('.relative-opening-time').text()).to.equal(
      'Open 24h today'
    );
    expect(comp.find('.relative-opening-time').hasClass('status-green')).to.be
      .true;
  });

  it('should display "closed today" if there are no hours today', () => {
    const recurringSchedule = getNamedSchedule('closed_today');
    const comp = shallow(
      <RelativeOpeningTime recurringSchedule={recurringSchedule} />
    );
    expect(comp.find('.relative-opening-time').text()).to.equal('Closed Today');
    expect(comp.find('.relative-opening-time').hasClass('status-red')).to.be
      .true;
  });

  it('should display "Closed until tomorrow" for a schedule that is closed until tomorrow', () => {
    const date = moment().startOf('day').add(18, 'hours').add(15, 'minutes');
    const recurringSchedule = getNamedSchedule('nine_to_six');
    const comp = shallow(
      <RelativeOpeningTime
        recurringSchedule={recurringSchedule}
        currentDate={date}
      />
    );
    expect(comp.find('.relative-opening-time').text()).to.equal(
      'Closed Until Tomorrow'
    );
    expect(comp.find('.relative-opening-time').hasClass('status-red')).to.be
      .true;
  });

  it('should display "Opens in 5 minutes" for a schedule that is just about to open', () => {
    const date = moment().startOf('day').add(8, 'hours').add(55, 'minutes');
    const recurringSchedule = getNamedSchedule('nine_to_six');
    const comp = shallow(
      <RelativeOpeningTime
        recurringSchedule={recurringSchedule}
        currentDate={date}
      />
    );
    expect(comp.find('.relative-opening-time').text()).to.equal(
      'Opens in 5 mins'
    );
    expect(comp.find('.relative-opening-time').hasClass('status-amber')).to.be
      .true;
  });

  it('should display "Closes in 10 minutes" for a schedule that is just about to close', () => {
    const date = moment().startOf('day').add(17, 'hours').add(50, 'minutes');
    const recurringSchedule = getNamedSchedule('nine_to_six');
    const comp = shallow(
      <RelativeOpeningTime
        recurringSchedule={recurringSchedule}
        currentDate={date}
      />
    );
    expect(comp.find('.relative-opening-time').text()).to.equal(
      'Closes in 10 mins'
    );
    expect(comp.find('.relative-opening-time').hasClass('status-amber')).to.be
      .true;
  });

  it('should display "Closed until tomorrow" for a schedule that was open today, but has closed until tomorrow', () => {
    const date = moment().startOf('day').add(18, 'hours').add(30, 'minutes');
    const recurringSchedule = getNamedSchedule('nine_to_six');
    const comp = shallow(
      <RelativeOpeningTime
        recurringSchedule={recurringSchedule}
        currentDate={date}
      />
    );
    expect(comp.find('.relative-opening-time').text()).to.equal(
      'Closed Until Tomorrow'
    );
    expect(comp.find('.relative-opening-time').hasClass('status-red')).to.be
      .true;
  });

  it('should display "Open now" for a schedule is open now, and has a closing time before open (tomorrow)', () => {
    const date = moment().startOf('day').add(18, 'hours').add(30, 'minutes');
    const recurringSchedule = getNamedSchedule('closes_tomorrow');
    const comp = shallow(
      <RelativeOpeningTime
        recurringSchedule={recurringSchedule}
        currentDate={date}
      />
    );
    expect(comp.find('.relative-opening-time').text()).to.equal('Open Now');
    expect(comp.find('.relative-opening-time').hasClass('status-green')).to.be
      .true;
  });
});
