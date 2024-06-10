import { createClient, type ClientConfig } from "@sanity/client";
import appConfig from "./config";

const todaysDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

const sanityConfig: ClientConfig = {
  projectId: appConfig.SANITY_PROJECT_ID,
  dataset: appConfig.SANITY_PROJECT_DATASET,
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: todaysDate, // use current date (YYYY-MM-DD) to target the latest API version
};
const client = createClient(sanityConfig);

export { client };