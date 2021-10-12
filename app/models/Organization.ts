import { get } from '../utils/DataService';
import { parseAPISchedule } from '../utils/transformSchedule';
import { Service, shouldServiceInheritScheduleFromOrg } from './Service';
import { Schedule } from './Schedule';
import {
  Address,
  Category,
  Note,
  PhoneNumber,
} from './Meta';
import { RecurringSchedule } from './RecurringSchedule';

// An Organization used to be called a 'Resource', and represents
// an institution that provides services to those experiencing homelessness
export interface Organization {
  id: number;
  name: string;
  addresses: Address[];
  alternate_name: string | null;
  categories: Category[];
  certified_at: string | null;
  certified: boolean;
  email: string | null;
  featured: boolean;
  legal_status: string | null;
  long_description: string | null;
  notes: Note[];
  phones: PhoneNumber[];
  recurringSchedule: RecurringSchedule;
  schedule: Schedule;
  services: Service[];
  short_description: string | null;
  source_attribution: string;
  status: 'pending' | 'approved' | 'rejected' | 'inactive';
  updated_at: string;
  verified_at: string | null;
  website: string | null;
}

export interface OrganizationParams extends Omit<Partial<Organization>, 'notes'> {
  notes?: Partial<Note>[];
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
    return {
      ...resource,
      recurringSchedule,
      services: resource.services.map(service => ({
        ...service,
        recurringSchedule: shouldServiceInheritScheduleFromOrg(service)
          ? parseAPISchedule(service.schedule)
          : recurringSchedule,
      })),
    };
  });

export const getResourceLocations = (org: Organization) => {
  const { addresses } = org;
  if (!addresses || !addresses.length) return [];

  return addresses.map(address => ({
    id: address.id,
    address,
    name: org.name,
    recurringSchedule: org.recurringSchedule,
  }));
};
