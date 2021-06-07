import { ServiceModel } from './Service';

export interface OrganizationModel {
  addresses: AddressModel[]
  alternate_name: string
  categories: CategoryModel[]
  certified_at: string
  certified: string
  email: string
  featured: string
  id: string
  legal_status: string
  long_description: string
  name: string
  notes: NoteModel[]
  phones: PhoneNumberModel[]
  ratings: string
  recurringSchedule: string
  schedule: string
  services: ServiceModel[]
  short_description: string
  source_attribution: string
  status: string
  updated_at: string
  verified_at: string
  website: string
}

export interface PhoneNumberModel {
  country_code: string
  extension: any
  id: number
  number: string
  service_type: string
}

export interface AddressModel {
  id: number
  attention?: string
  name: string
  address_1: string
  address_2: string
  address_3?: null
  address_4?: null
  city: string
  state_province: string
  postal_code: string
  country: string
  latitude: string
  longitude: string
}

export interface CategoryModel {
  name: string
  id: number
  top_level: boolean
  featured: boolean
}

export interface NoteModel {
  id: number
  note: string
}

// const getResourceLocations = resource => {
//   const { addresses } = resource;
//   if (!addresses || !addresses.length) return null;

//   return addresses.map(address => ({
//     id: address.id,
//     address,
//     name: resource.name,
//     recurringSchedule: resource.recurringSchedule,
//   }));
// };
