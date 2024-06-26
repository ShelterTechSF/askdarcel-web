import useSWR from "swr";
import fetcher from "utils/fetcher";
import { type Footer, type StrapiResponse } from "models/Strapi";
import config from "../config";

interface SWRHookResult<T> {
  data: T | null;
  error?: Error;
  isLoading: boolean;
}

function useStrapiHook<T>(path: string): SWRHookResult<T> {
  const dataFetcher = () =>
    fetcher<StrapiResponse<T>>(`${config.STRAPI_API_URL}/api/${path}`, {
      Authorization: `Bearer ${config.STRAPI_API_TOKEN}`,
    });

  const { data, error, isLoading } = useSWR<StrapiResponse<T>>(
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
  return useStrapiHook<Footer>("footer?populate[links][populate]=*");
}
