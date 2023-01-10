// React Hooks for interacting with the AskDarcel API service.

import { useState, useEffect } from 'react';

import * as dataService from '../utils/DataService';
import type { Category, Eligibility } from '../models/Meta';

// TODO: Handle failure?

/** Make an API call to fetch all eligibilities for a given categoryID.
 *
 * Returns the list of eligibilities. Returns null until the request succeeds.
 */
export const useEligibilitiesForCategory = (categoryID: string | null): Eligibility[] | null => {
  const [eligibilities, setEligibilities] = useState<Eligibility[] | null>(null);

  useEffect(() => {
    if (categoryID !== null) {
      dataService.get(`/api/eligibilities?category_id=${categoryID}`).then(response => {
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
export const useSubcategoriesForCategory = (categoryID: string | null) : Category[] | null => {
  const [subcategories, setSubcategories] = useState<Category[] | null>(null);

  useEffect(() => {
    if (categoryID !== null) {
      dataService.get(`/api/categories/subcategories?id=${categoryID}`).then(response => {
        setSubcategories(response.categories as Category[]);
      });
    }
  }, [categoryID]);

  return subcategories;
};
