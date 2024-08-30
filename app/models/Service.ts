import { get } from "../utils/DataService";
import type { Organization } from "./Organization";
import { Schedule, ScheduleParams, parseAPISchedule } from "./Schedule";
import { RecurringSchedule } from "./RecurringSchedule";
import {
  Address,
  Category,
  Eligibility,
  LocationDetails,
  Note,
  Program,
} from "./Meta";

export interface Instruction {
  id: number;
  instruction: string;
}

export interface Service {
  id: number;
  name: string;
  addresses?: Address[];
  alsoNamed: string;
  alternate_name: string | null;
  application_process: string | null;
  categories: Category[];
  certified_at: string | null;
  certified: boolean;
  documents: unknown[];
  eligibilities: Eligibility[];
  email: string | null;
  featured: boolean | null;
  fee: string | null;
  instructions: Instruction[];
  internal_note: string | null;
  interpretation_services: string | null;
  long_description: string | null;
  notes: Note[];
  program: Program | null;
  recurringSchedule: RecurringSchedule;
  required_documents: any;
  resource: Organization;
  schedule: Schedule;
  short_description: string;
  source_attribution: string;
  status: "pending" | "approved" | "rejected" | "inactive";
  updated_at: string;
  url: string | null;
  verified_at: Date | null;
  wait_time: Date | null;
}

export interface ServiceParams extends Omit<any, "notes" | "schedule"> {
  shouldInheritScheduleFromParent: boolean;
  notes?: Partial<Note>[];
  schedule?: ScheduleParams;
}

const UNKNOWN_ERROR_MESSAGE =
  "We were unable to process the request. Please contact your site administrator.";

// TODO This should be serviceAtLocation
export const getServiceLocations = (
  service: Service,
  resource: Organization,
  recurringSchedule: any
): LocationDetails[] => {
  let addresses: Address[];
  if (service.addresses && service.addresses.length > 0) {
    ({ addresses } = service);
  } else if (resource.addresses) {
    ({ addresses } = resource);
  } else {
    addresses = [];
  }
  return addresses.map((address) => ({
    id: address.id,
    address,
    name: service.name,
    recurringSchedule,
  }));
};

// Get all the fields from a service we should render
export const generateServiceDetails = (
  service: Service
): { title: string; value: any }[] =>
  [
    ["How to Apply", service.application_process],
    ["Required Documents", service.required_documents],
    ["Fees", service.fee],
    ["Notes", service.notes.map((d) => d.note).join("\n")],
  ]
    .filter((row) => row[1])
    .map((row) => ({ title: row[0], value: row[1] }));

// Determine if a service has its own schedule, or should inherit
export const shouldServiceInheritScheduleFromOrg = (service: any) =>
  service.schedule && service.schedule.schedule_days.length > 0;

export function fetchServiceSuccessHandler({ service }: { service: any }) {
  if (shouldServiceInheritScheduleFromOrg(service) && service.schedule) {
    const recurringSchedule = parseAPISchedule(service.schedule as Schedule);
    return { ...service, recurringSchedule } as Service;
  }

  if (service.resource?.schedule) {
    const recurringSchedule = parseAPISchedule(
      service.resource?.schedule as Schedule
    );
    return { ...service, recurringSchedule } as Service;
  }

  return UNKNOWN_ERROR_MESSAGE;
}

export function fetchServiceFailureHandler(fetchError: unknown) {
  return `There was a problem with the api response: ${fetchError}`;
}

export const fetchService = (id: string): Promise<string | Service> =>
  get(`/api/v2/services/${id}`)
    .then(fetchServiceSuccessHandler)
    .catch(fetchServiceFailureHandler);
