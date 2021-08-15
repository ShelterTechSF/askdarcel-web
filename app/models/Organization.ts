import { get } from '../utils/DataService';
import { parseAPISchedule } from '../utils/transformSchedule';
import { Service, shouldInheritSchedule } from './Service'; // eslint-disable-line import/no-cycle

export interface Organization {
  services: Service[]
  schedule: any
  status: 'approved' // TODO
  source_attribution: string
  addresses: Address[]
  // TODO
}

export interface Address {
  id: number
  // TODO
}

/**
 * Return a Promise with the fetched Resource.
 *
 * Also perform a transformation from the raw API representation of schedules
 * into a nicer-to-use data model of RecurringSchedules.
 */
export const getResource = (id: number) => get(`/api/resources/${id}`)
  .then(({ resource }: { resource: Organization }) => {
    const recurringSchedule = parseAPISchedule(resource.schedule);
    const services = resource.services.map(service => {
      const scheduleRecurringSchedule = shouldInheritSchedule(service)
        ? parseAPISchedule(service.schedule)
        : recurringSchedule;
      return {
        ...service,
        recurringSchedule: scheduleRecurringSchedule,
      };
    });
    return {
      ...resource,
      recurringSchedule,
      services,
    };
  });
