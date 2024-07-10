import { StrapiApi } from "hooks/StrapiAPI";

/**
  Model interfaces are a subtype of Strapi api responses that only include properties needed by consuming components
*/
export namespace StrapiModel {
  export interface StrapiDatum<T> extends StrapiApi.StrapiDatumResponse<T> {}
  export interface Link extends StrapiApi.LinkResponse {}
  export interface DynamicLink
    extends Omit<StrapiApi.DynamicLinkResponse, "__component"> {}
  export interface Footer extends StrapiApi.FooterResponse {}
  export interface Homepage extends StrapiApi.HomepageResponse {}
  export interface ContentBlock
    extends Omit<StrapiApi.ContentBlockResponse, "id"> {}
  export interface Event extends StrapiApi.EventResponse {}
  export interface Opportunity extends StrapiApi.OpportunityResponse {}
  export interface TwoColumnContentBlock
    extends StrapiApi.TwoColumnContentBlockResponse {}
  export interface PageContent extends StrapiApi.ContentPageResponse {}
  export interface Header extends StrapiApi.HeaderResponse {}
  export interface Logo
    extends Pick<
      StrapiApi.LogoResponse,
      "width" | "height" | "alternativeText" | "url"
    > {}
  export interface NavigationMenu
    extends Omit<StrapiApi.NavigationMenuResponse, "__component"> {}
}

export function extractNavigationMenusFromNavigationResponse(
  navigationResponse: StrapiApi.HeaderResponse | null
): ExtractedNavigationMenusFromNavigationResponse | null {
  return (
    (navigationResponse &&
      navigationResponse.navigation.map(({ __component, ...rest }) => rest)) ||
    null
  );
}

export function extractLogoFromNavigationResponse(
  navigationResponse: StrapiApi.HeaderResponse | null
): StrapiModel.Logo | null {
  return (
    (navigationResponse && navigationResponse.logo.data.attributes) || null
  );
}

export type ExtractedNavigationMenusFromNavigationResponse = Array<
  StrapiModel.NavigationMenu | StrapiModel.Link
>;
