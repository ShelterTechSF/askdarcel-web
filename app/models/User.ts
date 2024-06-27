import { get } from "utils/DataService";

export interface User {
  id: number;
  name: string;
  email: string;
  organization: string;
}

/** Get the API user of the currently authenticated user.
 *
 * If the current user is not authenticated, the returned promise will fail.
 */
export function getCurrentUser(authToken: string): Promise<User> {
  return get(`/api/v2/users/current`, {
    Authorization: `bearer ${authToken}`,
  });
}
