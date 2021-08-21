import { get } from '../utils/DataService';
import { parseAPISchedule } from '../utils/transformSchedule';
import { Service, shouldInheritSchedule } from './Service'; // eslint-disable-line import/no-cycle
import {
  Address,
  Category,
  Note,
  PhoneNumber,
  Schedule,
} from './Meta';

// An Organization used to be called a 'Resource', and represents
// an institution that provides services to those experiencing homelessness
export interface Organization {
  id: number
  name: string
  addresses: Address[]
  alternate_name: string|null
  categories: Category[]
  certified_at: string|null
  certified: boolean
  email: string|null
  featured: boolean
  legal_status: any
  long_description: string|null
  notes: Note[]
  phones: PhoneNumber[]
  recurringSchedule: any
  schedule: Schedule
  services: Service[]
  short_description: string|null
  source_attribution: string
  status: 'approved' // TODO
  updated_at: string
  verified_at: string|null
  website: string|null
}

/**
 * Return a Promise with the fetched Resource.
 *
 * Also perform a transformation from the raw API representation of schedules
 * into a nicer-to-use data model of RecurringSchedules.
 */
export const fetchOrganization = (id: number): Promise<Organization> => get(`/api/resources/${id}`)
  .then(({ resource }: { resource: Organization }) => {
    const recurringSchedule = parseAPISchedule(resource.schedule);
    const services = resource.services.map(service => {
      const scheduleRecurringSchedule = shouldInheritSchedule(service)
        ? parseAPISchedule(service.schedule)
        : recurringSchedule;
      return {
        ...service,
        recurringSchedule: scheduleRecurringSchedule,
      };
    });
    return {
      ...resource,
      recurringSchedule,
      services,
    } as any;
  });

export const getResourceLocations = (org: Organization) => {
  const { addresses } = org;
  if (!addresses || !addresses.length) return null;

  return addresses.map(address => ({
    id: address.id,
    address,
    name: org.name,
    recurringSchedule: org.recurringSchedule,
  }));
};
