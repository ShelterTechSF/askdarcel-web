import { get } from '../utils/DataService';
import { parseAPISchedule } from '../utils/transformSchedule';
import { Organization } from './Organization'; // eslint-disable-line import/no-cycle
import {
  Address,
  Category,
  Eligibility,
  Note,
  Program,
  Schedule,
} from './Meta';

// A Service is provided by an Organization
export interface Service {
  id: number
  name: string
  addresses?: Address[]
  alsoNamed: string
  alternate_name?: string|null
  application_process: any
  categories: Category[]
  certified_at: any
  certified: boolean
  eligibilities: Eligibility[]
  eligibility: any
  email: string|null
  featured: boolean|null
  fee: string|null
  interpretation_services: any
  long_description: string
  notes: Note[]
  program: Program|null
  recurringSchedule: any[]
  required_documents: any
  resource: Organization
  schedule: Schedule
  source_attribution: any
  updated_at: string
  url: string|null
  verified_at: any
  wait_time: any
}

export const shouldInheritSchedule = (service: Service) => (
  service.schedule && service.schedule.schedule_days.length > 0
);

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
export const generateServiceDetails = (service: Service): ({ title: string, value: any }[]) => [
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
