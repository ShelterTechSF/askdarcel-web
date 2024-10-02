/**
  Model interfaces are a subtype of Strapi api responses that only include properties needed by consuming components
*/
import {
  CalendarEventResponse,
  ContentBlockResponse,
  ContentPageResponse,
  DynamicLinkResponse,
  FooterResponse,
  HeaderResponse,
  HomepageResponse,
  ImageResponse,
  LinkResponse,
  LogoResponse,
  NavigationMenuResponse,
  StrapiDatumResponse,
  TwoColumnContentBlockResponse,
} from "hooks/StrapiAPI";

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface StrapiDatum<T> extends StrapiDatumResponse<T> {}
export interface Link extends LinkResponse {}
export interface DynamicLink extends Omit<DynamicLinkResponse, "__component"> {}
export interface Footer extends FooterResponse {}
export interface Homepage extends HomepageResponse {}
export interface ContentBlock extends Omit<ContentBlockResponse, "id"> {}
export interface TwoColumnContentBlock extends TwoColumnContentBlockResponse {}
export interface PageContent extends ContentPageResponse {}
export interface Header extends HeaderResponse {}
export interface Logo
  extends Pick<LogoResponse, "width" | "height" | "alternativeText" | "url"> {}
export interface NavigationMenu
  extends Omit<NavigationMenuResponse, "__component"> {}
export interface CalendarEvent extends CalendarEventResponse {}
export interface Image extends ImageResponse {}

export function extractNavigationMenusFromNavigationResponse(
  navigationResponse: HeaderResponse | null
): ExtractedNavigationMenusFromNavigationResponse | null {
  return (
    navigationResponse?.navigation.map(({ __component, ...rest }) => rest) ||
    null
  );
}

export function extractLogoFromNavigationResponse(
  navigationResponse: HeaderResponse | null
): Logo | null {
  return navigationResponse?.logo.data.attributes || null;
}

export type ExtractedNavigationMenusFromNavigationResponse = Array<
  NavigationMenu | Link
>;
