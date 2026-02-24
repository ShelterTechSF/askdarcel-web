// React Hooks for interacting with the AskDarcel API service.

import { useState, useEffect } from "react";

import * as dataService from "../utils/DataService";
import type { Category, Eligibility } from "../models/Meta";

// TODO: Handle failure?

/** Make an API call to fetch all eligibilities for a given categoryID.
 *
 * Returns the list of eligibilities. Returns null until the request succeeds.
 */
export const useEligibilitiesForCategory = (
  categoryID: string | null
): Eligibility[] | null => {
  const [eligibilities, setEligibilities] = useState<Eligibility[] | null>(
    null
  );

  useEffect(() => {
    if (categoryID !== null) {
      dataService
        .get(`/api/v2/eligibilities?category_id=${categoryID}`)
        .then((response) => {
          setEligibilities(response.eligibilities as Eligibility[]);
        });
    }
  }, [categoryID]);

  return eligibilities;
};
/** Make an API call to fetch all subcategories for a given categoryID.
 *
 * Returns the list of categories. Returns null until the request succeeds.
 */
export const useSubcategoriesForCategory = (
  categoryID: string | null
): Category[] | null => {
  const [subcategories, setSubcategories] = useState<Category[] | null>(null);

  useEffect(() => {
    if (categoryID !== null) {
      dataService
        .get(`/api/v2/categories/subcategories/${categoryID}`)
        .then((response) => {
          const categories = response.categories as Category[];

          /*
           * The sfsg-health (1000005) and sfsg-lgbtqa (1000008) categories
           * are getting a fake subcategory that represents a group of real
           * categories from the database.
           * The fake category will be show in the ServiceDiscoveryForm and
           * the real categories will be shown in the ServiceDiscoveryResults.
           */
          if (categoryID === "1000005" || categoryID === "1000008") {
            categories.push({ id: 0, name: "HIV & Aging" } as Category);
          }

          setSubcategories(categories);
        });
    }
  }, [categoryID]);

  return subcategories;
};
