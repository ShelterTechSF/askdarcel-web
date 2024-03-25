import { get } from "../utils/DataService";
import { Service, shouldServiceInheritScheduleFromOrg } from "./Service";
import { Schedule, parseAPISchedule } from "./Schedule";
import { Address, Category, LocationDetails, Note, PhoneNumber } from "./Meta";
import { RecurringSchedule } from "./RecurringSchedule";

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
  internal_note: string | null;
  legal_status: string | null;
  long_description: string | null;
  notes: Note[];
  phones: PhoneNumber[];
  recurringSchedule: RecurringSchedule;
  schedule: Schedule;
  services: Service[];
  short_description: string | null;
  source_attribution: string;
  status: "pending" | "approved" | "rejected" | "inactive";
  updated_at: string;
  verified_at: string | null;
  website: string | null;
}

export interface OrganizationParams
  extends Omit<Partial<Organization>, "notes"> {
  notes?: Partial<Note>[];
}

export interface OrganizationAction {
  name: string;
  icon: string;
  to?: string;
  link?: string;
}

/**
 * Return a Promise with the fetched Resource.
 *
 * Also perform a transformation from the raw API representation of schedules
 * into a nicer-to-use data model of RecurringSchedules.
 */
export const fetchOrganization = (id: string): Promise<Organization> =>
  get(`/api/v2/resources/${id}`).then(
    ({ resource }: { resource: Organization }) => {
      const recurringSchedule = parseAPISchedule(resource.schedule);
      return {
        ...resource,
        recurringSchedule,
        services: resource.services.map((service) => ({
          ...service,
          recurringSchedule: shouldServiceInheritScheduleFromOrg(service)
            ? parseAPISchedule(service.schedule)
            : recurringSchedule,
        })),
      };
    }
  );

export const getOrganizationLocations = (
  org: Organization
): LocationDetails[] => {
  const { addresses } = org;
  if (!addresses || !addresses.length) return [];

  return addresses.map((address) => ({
    id: address.id,
    address,
    name: org.name,
    recurringSchedule: org.recurringSchedule,
  }));
};

export const getOrganizationActions = (
  org: Organization
): OrganizationAction[] => {
  const phoneNumber = org?.phones?.[0]?.number;
  const latitude = org?.addresses?.[0]?.latitude;
  const longitude = org?.addresses?.[0]?.longitude;

  const actions: OrganizationAction[] = [
    // {
    //   name: 'Edit',
    //   icon: 'edit',
    //   to: `/organizations/${resource.id}/edit`,
    // },
    {
      name: "Print",
      icon: "print",
    },
    {
      name: "Share Feedback",
      icon: "feedback",
    },
  ];

  if (phoneNumber) {
    actions.push({
      name: "Call",
      icon: "phone",
      link: `tel:${phoneNumber}`,
    });
  }

  if (latitude && longitude) {
    actions.push({
      name: "Directions",
      icon: "directions",
      link: `http://google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
    });
  }

  return actions;
};
