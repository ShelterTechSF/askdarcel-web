import { createClient, type ClientConfig } from "@sanity/client";
import appConfig from "./config";

const todaysDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

const sanityConfig: ClientConfig = {
  projectId: appConfig.SANITY_PROJECT_ID,
  dataset: appConfig.SANITY_PROJECT_DATASET,
  useCdn: appConfig.SANITY_USE_CDN,
  perspective: appConfig.SANITY_PERSPECTIVE,
  token: appConfig.SANITY_API_TOKEN,
  withCredentials: appConfig.SANITY_WITH_CREDENTIALS,
  apiVersion: todaysDate, // use current date (YYYY-MM-DD) to target the latest API version
};
const client = createClient(sanityConfig);

export { client };
