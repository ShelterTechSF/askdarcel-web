import { get, post } from "utils/DataService";

export interface SavedSearchQuery {
  eligibilities: string[];
  categories: string[];
  lat: number | null;
  lng: number | null;
  query: string;
}

export interface SavedSearch {
  id: number;
  user_id: number;
  name: string;
  search: SavedSearchQuery;
}

type PostSavedSearch = Omit<SavedSearch, "id">;

export interface SavedSearches {
  saved_searches: SavedSearch[];
}

export function getSavedSearchesForUser(
  userId: number,
  authToken: string
): Promise<SavedSearches> {
  return get(`/api/v2/saved_searches?user_id=${userId}`, {
    Authorization: `bearer ${authToken}`,
  });
}

export function createSavedSearch(
  savedSearch: PostSavedSearch,
  authToken: string
): Promise<SavedSearch> {
  return post(`/api/v2/saved_searches`, savedSearch, {
    Authorization: `bearer ${authToken}`,
  }).then((resp) => resp.json());
}
