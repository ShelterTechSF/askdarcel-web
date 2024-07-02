/**
  NOTE @rosschapman: Developers may be tempted to auto-generate response types as described in the strapi docs using cli
  commands from the `@strapi/strapi` module, but I've noticed the output is funky for use in a client application in its
  raw form. For example, string fields from the recommended module are typed as `Attribute.String` but this type isn't compatible
  with `string` 🤦. Strapi offers this cumbersome approach to sync types, but also caveats this is not an official
  solution: https://strapi.io/blog/improve-your-frontend-experience-with-strapi-types-and-type-script. Even so, I still
  don't trust the generated types in view of the above example.
*/

import useSWR from "swr";
import fetcher from "utils/fetcher";
import config from "../config";

interface SWRHookResult<T> {
  data: T | null;
  error?: Error;
  isLoading: boolean;
}
function useStrapiHook<T>(path: string): SWRHookResult<T> {
  const dataFetcher = () =>
    fetcher<StrapiApi.BaseResponse<T>>(`${config.STRAPI_API_URL}/api/${path}`, {
      Authorization: `Bearer ${config.STRAPI_API_TOKEN}`,
    });
  const { data, error, isLoading } = useSWR<StrapiApi.BaseResponse<T>>(
    `/api/${path}`,
    dataFetcher
  );
  return {
    data: data?.data ? data.data.attributes : null,
    error,
    isLoading,
  };
}

export function useFooterData() {
  return useStrapiHook<StrapiApi.FooterResponse>("footer?populate[links][populate]=*");
}

export function useNavigationData() {
  return useStrapiHook<StrapiApi.HeaderResponse>("header?populate[logo]=*&populate[navigation][populate]=*");
}

export namespace StrapiApi {
  export interface BaseResponse<T> {
    data: {
      id: number;
      attributes: T;
      meta: {
        [key: string]: string;
      };
    } | null;
  }
  export interface LinkResponse {
    id: number;
    url: string;
    text: string;
  }

  export interface DynamicLinkResponse {
    id: number;
    // __component is a key used by Strapi
    // that may not have practical purposes for the frontend
    __component: string;
    title: string;
    link: LinkResponse[];
  }

  export interface FooterResponse {
    address: string;
    email_address: string;
    phone_number: string;
    links: DynamicLinkResponse[];
  }

  export interface HeaderResponse {
    logo: {
      data: {
        attributes: LogoResponse;
      };
    };
    navigation: NavigationMenuResponse[];
  };

  export interface ImageFormatResponse {
    ext: string;
    url: string;
    hash: string;
    mime: string;
    name: string;
    path?: string;
    size: number;
    width: number;
    height: number;
    sizeInBytes: number;
  }

  export interface FormatsResponse {
    large: ImageFormatResponse;
    medium: ImageFormatResponse;
    small: ImageFormatResponse;
    thumbnail: ImageFormatResponse;
  }

  export interface LogoResponse {
    name: string;
    alternativeText: string;
    caption: string;
    width: number;
    height: number;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string;
    provider: string;
    createdAt: string;
    updatedAt: string;
    formats: FormatsResponse;
    // TODO uknown types
    // provider_metadata: null;
  }

  export interface NavigationMenuResponse {
    id: number;
    __component: "navigation.menu";
    // The plurality mismatch here is a quirk of strapi's serialization of repeatable nested components
    link: LinkResponse[];
    title: string;
  }
}
