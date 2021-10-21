import { Service } from './Service';
import { Organization } from './Organization';
import { ScheduleDay } from './Schedule';
import { parseAlgoliaSchedule } from '../utils/transformSchedule';

export interface ServiceHit extends Omit<Service, 'schedule'> {
  type: 'service';
  resource_schedule: ScheduleDay[];
  schedule: ScheduleDay[];
}

export interface OrganizationHit extends Omit<Organization, 'schedule'> {
  type: 'resource';
  schedule: ScheduleDay[];
}

export type SearchHit = ServiceHit | OrganizationHit

/**
 * Transform Algolia search hits such that each hit has a recurringSchedule that
 * uses the time helper classes.
 */
export const transformHits = (hits: SearchHit[]) => hits.map(hit => {
  switch (hit.type) {
    case 'resource':
      return {
        ...hit,
        recurringSchedule: hit.schedule?.length ? parseAlgoliaSchedule(hit.schedule) : null,
      };
    case 'service':
      // eslint-disable-next-line no-case-declarations
      const schedule = hit.schedule || hit.resource_schedule;
      return {
        ...hit,
        recurringSchedule: schedule?.length ? parseAlgoliaSchedule(schedule) : null,
      };
    default:
      return null;
  }
});
