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
  sortBy24HourAvailability: boolean = false
) => {
  const hitsWithRecurringSchedule = hits.flatMap((hit) => {
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

  return sortBy24HourAvailability
    // Some of our tile category results that may provide more urgent services need to be sorted
    // by 24 hour availability. Moreover, in some cases, certain services, that have "24/7" in
    // their name should be prioritized as well. Thus, this logic orders hits by 24/7
    // availability, and if there are ties, where both services in the comparison are open 24/7,
    // the logic breaks the tie by alphabetical rank – this is a heuristic of sorts
    // to prioritize services with names beginning with the numeric "24".
    ? hitsWithRecurringSchedule.sort((a, b) => {
      const aIsOpen24_7 = a.recurringSchedule && a.recurringSchedule.isOpen24_7();
      const bIsOpen24_7 = b.recurringSchedule && b.recurringSchedule.isOpen24_7();
      if (aIsOpen24_7 === bIsOpen24_7) {
        return a.name <= b.name ? -1 : 1;
      }

      if (aIsOpen24_7) {
        return -1;
      }

      return 1;
    })
    : hitsWithRecurringSchedule;
};
