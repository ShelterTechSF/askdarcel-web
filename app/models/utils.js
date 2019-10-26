import { parseAPISchedule } from '../utils/transformSchedule';


export const PENDING = actionType => `${actionType}_PENDING`;
export const FULFILLED = actionType => `${actionType}_FULFILLED`;
export const REJECTED = actionType => `${actionType}_REJECTED`;


const shouldInheritSchedule = service => {
  console.log('inherit', service.schedule && service.schedule.schedule_days.length > 0);
  return service.schedule && service.schedule.schedule_days.length > 0;
};


/** (taken from utils/DataService)
 * Perform a transformation from the raw API representation of schedules
 * into a nicer-to-use data model of RecurringSchedules.
 */

// FIXME: test me
export const addRecurSchedToResource = resource => {
  const recurringSchedule = parseAPISchedule(resource.schedule);
  const services = resource.services.map(service => {
    const scheduleRecurringSchedule = shouldInheritSchedule(service)
      ? parseAPISchedule(service.schedule)
      : recurringSchedule;
    return {// FIXME: recur sched mutation error
      ...service,
      recurringSchedule: scheduleRecurringSchedule,
    };
  });
  return {
    ...resource,
    recurringSchedule,
    services,
  };
};
