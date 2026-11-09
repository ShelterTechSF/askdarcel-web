import { round } from "./numbers";

export type GeoCoordinates = { lat: number; lng: number };

export const COORDS_MID_SAN_FRANCISCO: GeoCoordinates = {
  lat: 37.7749,
  lng: -122.4194,
};

export const areCoordsInSanFrancisco = (coords: GeoCoordinates): boolean => {
  // These are conservative bounds, extending into the ocean, the Bay, and Daly City.
  const bb = {
    top: 37.820633,
    left: -122.562447,
    bottom: 37.688167,
    right: -122.326927,
  };
  return (
    coords.lat > bb.bottom &&
    coords.lat < bb.top &&
    coords.lng > bb.left &&
    coords.lng < bb.right
  );
};

/**
 * Thrown by getLocationBrowser when the browser successfully returns a real
 * location, but it falls outside the bounds we support.
 */
export class OutOfBoundsLocationError extends Error {}

/**
 * Get location via HTML5 Geolocation API.
 */
export const getLocationBrowser = () =>
  new Promise<GeoCoordinates>((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: GeoCoordinates = {
            lat: round(position.coords.latitude, 4),
            lng: round(position.coords.longitude, 4),
          };
          if (areCoordsInSanFrancisco(coords)) {
            resolve(coords);
          } else {
            const msg = `User location out of bounds: ${coords.lat},${coords.lng}`;
            console.log(msg); // eslint-disable-line no-console
            reject(new OutOfBoundsLocationError(msg));
          }
        },
        (error) => {
          console.log(error); // eslint-disable-line no-console
          reject(error);
        }
      );
    } else {
      const msg = "Geolocation is not supported by this browser.";
      console.log(msg); // eslint-disable-line no-console
      reject(msg);
    }
  });

export const useDefaultSanFranciscoLocation = () =>
  new Promise<GeoCoordinates>((resolve) => {
    resolve(COORDS_MID_SAN_FRANCISCO);
  });

/**
 * Get user location.
 *
 * Makes use of the HTML5 Geolocation API. Currently restricts the location to
 * within San Francisco to avoid inaccurate geolocation results. This restriction
 * should be removed if more locations are added.
 *
 * @returns A Promise of a location, which is an object with `lat` and `lng`
 * properties.
 */
export const getLocation = () =>
  getLocationBrowser().catch(() => useDefaultSanFranciscoLocation());
