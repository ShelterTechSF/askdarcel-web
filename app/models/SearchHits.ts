import { Service } from "./Service";
import { Organization } from "./Organization";
import { ScheduleDay, parseAlgoliaSchedule } from "./Schedule";
import { PhoneNumber } from "./Meta";
import { RecurringSchedule } from "./RecurringSchedule";

export interface ServiceHit
  extends Omit<Service, "schedule" | "recurringSchedule" | "instructions"> {
  type: "service";
  instructions: string[];
  phones: PhoneNumber[];
  recurringSchedule: RecurringSchedule | null;
  resource_id: number;
  resource_schedule: ScheduleDay[];
  schedule: ScheduleDay[];
  service_of: string;
}

export interface OrganizationHit
  extends Omit<Organization, "schedule" | "recurringSchedule"> {
  type: "resource";
  schedule: ScheduleDay[];
  recurringSchedule: RecurringSchedule | null;
}

export type SearchHit = ServiceHit | OrganizationHit;

/**
 * Transform Algolia search hits such that each hit has a recurringSchedule that
 * uses the time helper classes.
 */
export const transformHits = (hits: SearchHit[]) =>
  hits.flatMap((hit) => {
    switch (hit.type) {
      case "resource":
        return {
          ...hit,
          recurringSchedule: hit.schedule?.length
            ? parseAlgoliaSchedule(hit.schedule)
            : null,
        };
      case "service": {
        const schedule = hit.schedule || hit.resource_schedule;
        return {
          ...hit,
          recurringSchedule: schedule?.length
            ? parseAlgoliaSchedule(schedule)
            : null,
        };
      }
      default:
        // The item is neither a service or resource and should be removed.
        // A 0 element array removes the item from the mapped array
        return [];
    }
  });
