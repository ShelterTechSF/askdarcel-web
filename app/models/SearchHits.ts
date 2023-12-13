import { Service } from "./Service";
import { Organization } from "./Organization";
import { ScheduleDay, parseAlgoliaSchedule } from "./Schedule";
import { PhoneNumber } from "./Meta";
import { RecurringSchedule } from "./RecurringSchedule";

interface BaseHit {
  _geoloc: { lat: number; lng: number };
  is_mohcd_funded: boolean;
  resource_id: number;
}

export interface ServiceHit
  extends Omit<Service, "schedule" | "recurringSchedule" | "instructions">,
    BaseHit {
  type: "service";
  instructions: string[];
  phones: PhoneNumber[];
  recurringSchedule: RecurringSchedule | null;
  resource_schedule: ScheduleDay[];
  schedule: ScheduleDay[];
  service_id: number;
  service_of: string;
}

export interface OrganizationHit
  extends Omit<Organization, "schedule" | "recurringSchedule">,
    BaseHit {
  type: "resource";
  schedule: ScheduleDay[];
  recurringSchedule: RecurringSchedule | null;
}

export type SearchHit = ServiceHit | OrganizationHit;

/**
 * Transform Algolia search hits such that each hit has a recurringSchedule that
 * uses the time helper classes.
 */
export const transformHits = (
  hits: SearchHit[],
  sortAlphabetically: boolean = false
) => {
  const hitsWithSchedule = hits.flatMap((hit) => {
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

  return sortAlphabetically
    ? hitsWithSchedule.sort((a, b) => (a.name < b.name ? -1 : 1))
    : hitsWithSchedule;
};
