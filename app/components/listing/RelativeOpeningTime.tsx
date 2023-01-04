import React, { useEffect, useState } from 'react';
import moment, { Moment } from 'moment';
import { Duration, RecurringSchedule, RecurringTime } from '../../models/RecurringSchedule';

const STATUS_CLOSED = 'status-red';
const STATUS_OPEN = 'status-green';
const STATUS_CAUTION = 'status-amber';

/**
 * Get RelativeOpeningTime from schedule and current date.
 *
 * @param {RecurringSchedule} recurringSchedule
 * @param {moment} currentDate
 * @return {RelativeOpeningTime}
 */
const getRelativeOpeningTime = (recurringSchedule: RecurringSchedule, currentDate: Moment) => {
  if (!recurringSchedule) return { text: '', classes: '' };
  if (!recurringSchedule.hoursKnown) {
    return { text: 'Call for Hours', classes: STATUS_CAUTION };
  }
  if (recurringSchedule.isOpen24_7()) {
    return { text: 'Open 24/7', classes: STATUS_OPEN };
  }
  const currentRecurringTime = new RecurringTime({
    day: currentDate.day(),
    hour: currentDate.hour(),
    minute: currentDate.minute(),
  });

  const nearestInterval = recurringSchedule.findNearestInterval(currentRecurringTime);
  if (nearestInterval) {
    if (nearestInterval.overlapsTime(currentRecurringTime)) {
      if (nearestInterval.is24Hours()) {
        return { text: 'Open 24h today', classes: STATUS_OPEN };
      }
      const closesIn = nearestInterval.closesAt.difference(currentRecurringTime);
      if (closesIn <= Duration.fromMinutes(30)) {
        return { text: `Closes in ${closesIn.asMinutes()} mins`, classes: STATUS_CAUTION };
      }
      return { text: 'Open Now', classes: STATUS_OPEN };
    }

    const opensIn = nearestInterval.opensAt.difference(currentRecurringTime);
    if (opensIn < Duration.fromMinutes(30)) {
      return { text: `Opens in ${opensIn.asMinutes()} mins`, classes: STATUS_CAUTION };
    }

    if (nearestInterval.opensAt.day === currentDate.day()) {
      return { text: 'Closed Now', classes: STATUS_CLOSED };
    }

    const tomorrow = (currentDate.day() + 1) % 7;
    if (nearestInterval.opensAt.day === tomorrow) {
      return { text: 'Closed Until Tomorrow', classes: STATUS_CLOSED };
    }
  }

  return { text: 'Closed Today', classes: STATUS_CLOSED };
};

export const RelativeOpeningTime = ({ recurringSchedule, currentDate = moment() }: {
  recurringSchedule: RecurringSchedule;
  currentDate?: Moment;
}) => {
  const [, setSteps] = useState(0);
  const { text, classes } = getRelativeOpeningTime(recurringSchedule, currentDate);

  useEffect(() => {
    // Just to force re-render this component every minute
    const tick = setInterval(() => setSteps(s => s + 1));
    return () => clearInterval(tick);
  }, []);

  return (
    <span className={`relative-opening-time ${classes}`}>
      { text }
    </span>
  );
};
