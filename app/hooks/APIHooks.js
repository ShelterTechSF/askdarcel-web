// React Hooks for interacting with the AskDarcel API service.

import { useState, useEffect } from 'react';

import * as dataService from '../utils/DataService';

// TODO: Handle failure?

/** Make an API call to fetch all eligibilities for a given categoryID.
 *
 * Returns the list of eligibilities. Returns null until the request succeeds.
 */
export const useEligibilitiesForCategory = categoryID => {
  const [eligibilities, setEligibilities] = useState(null);

  useEffect(() => {
    if (categoryID !== null) {
      dataService.get(`/api/eligibilities?category_id=${categoryID}`).then(response => {
        setEligibilities(response.eligibilities);
      });
    }
  }, [categoryID]);

  return eligibilities;
};

/** Make an API call to fetch all subcategories for a given categoryID.
 *
 * Returns the list of categories. Returns null until the request succeeds.
 */
export const useSubcategoriesForCategory = categoryID => {
  const [subcategories, setSubcategories] = useState(null);

  useEffect(() => {
    if (categoryID !== null) {
      dataService.get(`/api/categories/subcategories?id=${categoryID}`).then(response => {
        setSubcategories(response.categories);
      });
    }
  }, [categoryID]);

  return subcategories;
};
