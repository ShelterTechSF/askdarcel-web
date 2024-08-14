import { RecurringSchedule } from "./RecurringSchedule";

export interface Address {
  id: number;
  attention: string | null;
  name: string | null;
  address_1: string;
  address_2: string | null;
  address_3: string | null;
  address_4: string | null;
  city: string;
  state_province: string;
  postal_code: string;
  latitude: string;
  longitude: string;
}

export interface LocationDetails {
  id: number;
  address: Address;
  name: string;
  recurringSchedule: RecurringSchedule;
}

export interface NewsArticle {
  id: string;
  body: string | null;
  effective_date: string | null;
  expiration_date: string | null;
  headline: string | null;
  priority: number | null;
  url: string | null;
}

export interface PhoneNumber {
  id: number;
  number: string;
  extension?: string;
  service_type: string;
  country_code: string;
}

export interface Note {
  id: number;
  note: string;
}

export interface Category {
  id: number;
  name: string;
  top_level: boolean;
  featured: boolean;
}

export interface Eligibility {
  id: number;
  name: string;
  feature_rank: number;
}

export interface Program {
  id: number;
  name: string;
}

export type BackgroundColorVariant = "primary" | "secondary" | "tertiary";
