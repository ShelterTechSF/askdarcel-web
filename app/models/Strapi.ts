import { StrapiApi } from "hooks/StrapiAPI";

/**
  Model interfaces are a subtype of Strapi api responses that only include properties needed by consuming components
*/
export namespace StrapiModel {
  export interface Link extends StrapiApi.LinkResponse {}
  export interface DynamicLink
    extends Omit<StrapiApi.DynamicLinkResponse, "__component"> {}
  export interface Footer extends StrapiApi.FooterResponse {}
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
  navigationResponse: StrapiModel.Header | null
): ExtractedNavigationMenusFromNavigationResponse | null {
  return (
    navigationResponse &&
    navigationResponse.navigation.map(({ __component, ...rest }) => rest)
  );
}

export function extractLogoFromNavigationResponse(
  navigationResponse: StrapiModel.Header | null
): StrapiModel.Logo | null {
  return navigationResponse && navigationResponse.logo.data.attributes;
}

export type ExtractedNavigationMenusFromNavigationResponse = Array<
  StrapiModel.NavigationMenu | StrapiModel.Link
>;
