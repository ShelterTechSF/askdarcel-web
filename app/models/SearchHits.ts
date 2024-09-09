import { Hit, SearchHits } from "algoliasearch";
// eslint-disable-next-line import/no-extraneous-dependencies
import algoliasearchHelper from "algoliasearch-helper";
import { Service } from "./Service";
import { Organization } from "./Organization";
import { ScheduleDay, parseAlgoliaSchedule } from "./Schedule";
import { PhoneNumber } from "./Meta";
import { RecurringSchedule } from "./RecurringSchedule";

interface BaseHit extends Hit {
  _geoloc: { lat: number; lng: number };
  is_mohcd_funded: boolean;
  resource_id: number;
}

export interface ServiceHit
  extends Omit<Service, "schedule" | "recurringSchedule" | "instructions">,
    BaseHit {
  type: "service";
  instructions: string[] | [];
  phones: PhoneNumber[] | [];
  recurringSchedule: RecurringSchedule | null;
  resource_schedule: ScheduleDay[] | [];
  schedule: ScheduleDay[] | [];
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
// TODO: type fix
export type SearchResultsResponse = SearchHits<SearchHit>;
export type SearchHit = ServiceHit | OrganizationHit;
type Location = {
  id: string;
  lat: string;
  long: string;
  label: string;
};
export type TransformedSearchHit = Hit<
  SearchHit & {
    recurringSchedule: RecurringSchedule | null;
    resultListIndexDisplay: string;
    longDescription: string;
    path: string;
    headline: string;
    geoLocPath: string;
    phoneNumber: string | null;
    websiteUrl: string | null;
    locations: Location[] | [];
    addressDisplay: string;
  }
>;

// TODO: Determine if we need this code
export const getRecurringScheduleForSeachHit = (
  hit: SearchHit
): RecurringSchedule | null => {
  let result = null;

  if (hit.type === "resource") {
    result = hit.schedule?.length ? parseAlgoliaSchedule(hit.schedule) : null;
  }

  if (hit.type === "service") {
    const schedule = hit.schedule || hit.resource_schedule;

    result = schedule?.length ? parseAlgoliaSchedule(schedule) : null;
  }

  return result;
};

function getLocations(
  hit: SearchHit,
  resultListIndexDisplay: string
): Location[] | [] {
  if (!hit.addresses) return [];

  return hit.addresses.map((address, idx) => {
    let label = resultListIndexDisplay;
    // unique ID for use as iteration key
    const id = `${hit.id}.${idx}`;

    // With multiple locations append an incrementing alpha character. For example, if the first result has two
    // addresses, it would appear on the map with two locations labeled 1A and 1B.
    if (idx > 0) {
      const alphabeticalIndex = (idx + 9).toString(36).toUpperCase();
      label = `${resultListIndexDisplay}${alphabeticalIndex}`;
    }

    return {
      id,
      lat: address.latitude,
      long: address.longitude,
      label,
    };
  });
}

function getAddressDisplay(hit: SearchHit) {
  if (hit.addresses?.length === 0) {
    return `No address found`;
  }
  if (hit.addresses && hit.addresses.length > 1) {
    return `Multiple locations`;
  }
  if (hit.addresses && hit.addresses[0].address_1) {
    return `${hit.addresses[0].address_1}`;
  }

  return `No address found`;
}

// Returns a view model of search result data for use in downstream components
// Developers are encouraged to manage computed properties here rather than within presentational components
export function transformSearchResults(
  searchResults: algoliasearchHelper.SearchResults<SearchHit>
) {
  // Algolia's api response types these properties as optional, although in practice they always appear
  // in results in our searches
  const currentPage: number = searchResults.page ?? 0;
  const hitsPerPage: number = searchResults.hitsPerPage ?? 20;

  const transformedHits = searchResults.hits.reduce<TransformedSearchHit[]>(
    (acc, hit, index: number) => {
      const phoneNumber = hit?.phones?.[0]?.number || null;
      const websiteUrl = hit.type === "service" ? hit.url : hit.website;
      const basePath = hit.type === "service" ? `services` : `organizations`;
      const hitId = hit.type === "service" ? hit.service_id : hit.resource_id;
      // @ts-ignore
      const resultListIndexDisplay = `${currentPage * hitsPerPage + index + 1}`;

      const nextHit = {
        ...hit,
        recurringSchedule: getRecurringScheduleForSeachHit(hit),
        resultListIndexDisplay,
        longDescription: hit.long_description || "No description, yet...",
        path: `/${basePath}/${hitId}`,
        headline: `${resultListIndexDisplay}. ${hit.name}`,
        geoLocPath: `http://google.com/maps/dir/?api=1&destination=${hit._geoloc.lat},${hit._geoloc.lng}`,
        phoneNumber,
        websiteUrl,
        locations: getLocations(hit, resultListIndexDisplay),
        addressDisplay: getAddressDisplay(hit),
      };

      acc.push(nextHit);
      return acc;
    },
    []
  );

  return {
    ...searchResults,
    hits: transformedHits,
  };
}
