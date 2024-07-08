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
}
