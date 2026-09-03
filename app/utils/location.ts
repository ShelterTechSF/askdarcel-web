import { round } from "./numbers";
import config from "../config";

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
 * location, but it falls outside the bounds we support. This is distinct
 * from other rejection reasons (permission denied, unsupported browser,
 * timeout, etc.) because it means we already have a real answer -- there's
 * no reason to believe Google's (IP-based, less precise) Geolocation API
 * would give a meaningfully different result, so callers can skip that
 * billed API call and fall straight back to the default location.
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

/**
 * Get location via the Google Maps Geolocation API.
 * If the location is cached, don't call the API.
 * Return the cached location instead.
 */
export const getLocationGoogle = () => {
  const cachedLocation = getCachedUserLocation();
  if (cachedLocation) {
    return new Promise<GeoCoordinates>((resolve, reject) => {
      if (areCoordsInSanFrancisco(cachedLocation)) {
        resolve(cachedLocation);
      } else {
        const msg = "User location out of bounds";
        reject(msg);
      }
    });
  }

  return new Promise<GeoCoordinates>((resolve, reject) => {
    // Results are not very accurate
    let url = "https://www.googleapis.com/geolocation/v1/geolocate";
    if (config.GOOGLE_API_KEY) {
      url += `?key=${config.GOOGLE_API_KEY}`;
    }
    fetch(url, { method: "post" })
      .then((r) => r.json())
      .then(({ location }: { location: GeoCoordinates }) => {
        setCachedUserLocation(location);
        if (areCoordsInSanFrancisco(location)) {
          resolve(location);
        } else {
          const msg = "User location out of bounds";
          reject(msg);
        }
      })
      .catch(reject);
  });
};

/**
 * Caches the results of the Google geolocation call for a two hours
 */
const setCachedUserLocation = (location: GeoCoordinates) => {
  const now = new Date();
  const hoursToExpire = 2;
  const locationObject = {
    location,
    expiry: now.setHours(now.getHours() + hoursToExpire),
  };

  localStorage.setItem("location", JSON.stringify(locationObject));
};

const getCachedUserLocation = (): GeoCoordinates | null => {
  const locationString = localStorage.getItem("location");
  if (locationString) {
    const { location, expiry } = JSON.parse(locationString);
    if (new Date() < expiry) {
      return location;
    }
  }

  return null;
};

export const useDefaultSanFranciscoLocation = () =>
  new Promise<GeoCoordinates>((resolve) => {
    resolve(COORDS_MID_SAN_FRANCISCO);
  });

/**
 * Get user location.
 *
 * Makes use of both the HTML5 Geolocation API and the Google Maps Geolocation
 * API. Currently restricts the location to within San Francisco to avoid
 * inaccurate geolocation results, but this should be removed if more locations
 * are added.
 *
 * @returns A Promise of a location, which is either an object with `lat` and
 * `lng` properties or an error if location is unavaible or out of bounds.
 */
export const getLocation = () =>
  getLocationBrowser().catch((reason) => {
    if (reason instanceof OutOfBoundsLocationError) {
      // The browser gave us a real, precise location -- it's just outside
      // the area we support. Calling Google's (IP-based, less precise)
      // Geolocation API here is very unlikely to give a meaningfully
      // different answer, so skip that billed call and go straight to the
      // default location.
      return useDefaultSanFranciscoLocation();
    }

    // Any other rejection reason (permission denied, unsupported browser,
    // timeout, etc.) means we don't have a real location yet, so it's
    // still worth trying Google's Geolocation API as a fallback.
    return getLocationGoogle().catch(() => useDefaultSanFranciscoLocation());
  });
