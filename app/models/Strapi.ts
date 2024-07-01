import { StrapiApi } from 'hooks/StrapiAPI';

/**
  Model interfaces are a subtype of Strapi api responses that only include properties needed by consuming components
*/
export namespace StrapiModel {
  export interface Link extends StrapiApi.LinkResponse { }
  export interface DynamicLink extends Omit<StrapiApi.DynamicLinkResponse, "__component"> { }
  export interface Footer extends StrapiApi.FooterResponse { }
  export interface Header extends StrapiApi.HeaderResponse { }
  export interface Logo extends Pick<StrapiApi.LogoResponse, "width" | "height" | "alternativeText" | "url"> { }
  export interface NavigationMenu extends StrapiApi.NavigationMenuResponse {
  }
}
