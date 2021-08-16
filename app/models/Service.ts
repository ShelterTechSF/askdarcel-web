import { get } from '../utils/DataService';
import { parseAPISchedule } from '../utils/transformSchedule';
import { Address, Organization } from './Organization'; // eslint-disable-line import/no-cycle

// A Service is provided by an Organization
export interface Service {
  id: number
  name: string
  long_description: string
  schedule: any
  recurringSchedule: any[]
  resource: Organization
  alsoNamed: string
  addresses?: Address[]
  application_process: any
  required_documents: any
  fee: any
  notes: any[]
  program: any|null
  // TODO
}

export const shouldInheritSchedule = (service: Service) => (
  service.schedule && service.schedule.schedule_days.length > 0
);

// TODO This should be serviceAtLocation
export const getServiceLocations = (service: Service, resource: Organization, recurringSchedule: any) => {
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
