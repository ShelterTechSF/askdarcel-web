import { get } from '../utils/DataService';
import { parseAPISchedule } from '../utils/transformSchedule';
import type { Organization } from './Organization';
import { Schedule, ScheduleParams } from './Schedule';
import { RecurringSchedule } from './RecurringSchedule';
import {
  Address,
  Category,
  Eligibility,
  LocationDetails,
  Note,
  Program,
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
  recurringSchedule: RecurringSchedule;
  required_documents: any;
  resource: Organization;
  schedule: Schedule;
  source_attribution: string;
  updated_at: string;
  url: string | null;
  verified_at: any;
  wait_time: any;
}

export interface ServiceParams extends Omit<Partial<Service>, 'notes'|'schedule'> {
  shouldInheritScheduleFromParent: boolean;
  notes?: Partial<Note>[];
  schedule?: ScheduleParams;
}

// TODO This should be serviceAtLocation
export const getServiceLocations = (
  service: Service,
  resource: Organization,
  recurringSchedule: any,
): LocationDetails[] => {
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

// Determine if a service has its own schedule, or should inherit
export const shouldServiceInheritScheduleFromOrg = (service: Service) => (
  service.schedule && service.schedule.schedule_days.length > 0
);

/**
 * Return a Promise with the fetched Service.
 *
 * Also perform a transformation from the raw API representation of schedules
 * into a nicer-to-use data model of RecurringSchedules.
 */
export const fetchService = (id: string): Promise<Service> => get(`/api/services/${id}`)
  .then(({ service }) => {
    const recurringSchedule = shouldServiceInheritScheduleFromOrg(service)
      ? parseAPISchedule(service.schedule)
      : parseAPISchedule(service.resource.schedule);
    return { ...service, recurringSchedule };
  });
