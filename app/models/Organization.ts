import { get } from '../utils/DataService';
import { parseAPISchedule } from '../utils/transformSchedule';
import type { Service } from './Service';
import {
  Address,
  Category,
  Note,
  PhoneNumber,
  Schedule,
  shouldInheritSchedule,
} from './Meta';

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
  schedule: Schedule;
  services: Service[];
  short_description: string | null;
  source_attribution: string;
  status: 'pending' | 'approved' | 'rejected' | 'inactive';
  updated_at: string;
  verified_at: string | null;
  website: string | null;
}

/**
 * Return a Promise with the fetched Resource.
 *
 * Also perform a transformation from the raw API representation of schedules
 * into a nicer-to-use data model of RecurringSchedules.
 */
export const getResource = (id: number) => get(`/api/resources/${id}`)
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
    };
  });
