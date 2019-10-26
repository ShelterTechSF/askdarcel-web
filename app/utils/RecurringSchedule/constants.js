import { invert } from 'lodash';

// WARNING: This must match Moment.js's day of week to integer mapping.
export const DAY_TO_INT = Object.freeze({
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
});

export const INT_TO_DAY = Object.freeze(invert(DAY_TO_INT));

export const DAYS_IN_WEEK = 7;
export const HOURS_IN_DAY = 24;
export const MINUTES_IN_HOUR = 60;
