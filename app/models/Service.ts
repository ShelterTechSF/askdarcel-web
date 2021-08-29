import { get } from '../utils/DataService';
import { parseAPISchedule } from '../utils/transformSchedule';
import type { Organization } from './Organization';
import {
  Address,
  Category,
  Eligibility,
  Note,
  Program,
  Schedule,
  shouldInheritSchedule,
} from './Meta';

// A Service is provided by an Organization
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
  eligibilities: Eligibility[];
  eligibility: string;
  email: string | null;
  featured: boolean | null;
  fee: string | null;
  interpretation_services: string | null;
  long_description: string;
  notes: Note[];
  program: Program | null;
  recurringSchedule: any[]; // TODO Move RecurringSchedule to models
  required_documents: any;
  resource: Organization;
  schedule: Schedule;
  source_attribution: string;
  updated_at: string;
  url: string | null;
  verified_at: any;
  wait_time: any;
}

// TODO This should be serviceAtLocation
export const getServiceLocations = (
  service: Service,
  resource: Organization,
  recurringSchedule: any,
) => {
  let addresses: Address[];
  if (service.addresses && service.addresses.length > 0) {
    ({ addresses } = service);
  } else if (resource.addresses) {
    ({ addresses } = resource);
  } else {
    addresses = [];
  }
  return addresses.map(address => ({
    id: address.id,
    address,
    name: service.name,
    recurringSchedule,
    // Just to make it clear this is inherited from the resource
    inherited: !recurringSchedule && resource.schedule,
  }));
};

// Get all the fields from a service we should render
export const generateServiceDetails = (service: Service): ({ title: string; value: any }[]) => [
  ['How to Apply', service.application_process],
  ['Required Documents', service.required_documents],
  ['Fees', service.fee],
  ['Notes', service.notes.map(d => d.note).join('\n')],
].filter(row => row[1])
  .map(row => ({ title: row[0], value: row[1] }));

/**
 * Return a Promise with the fetched Service.
 *
 * Also perform a transformation from the raw API representation of schedules
 * into a nicer-to-use data model of RecurringSchedules.
 */
export const fetchService = (id: number): Promise<Service> => get(`/api/services/${id}`)
  .then(({ service }) => {
    const recurringSchedule = shouldInheritSchedule(service)
      ? parseAPISchedule(service.schedule)
      : parseAPISchedule(service.resource.schedule);
    return { ...service, recurringSchedule };
  });
