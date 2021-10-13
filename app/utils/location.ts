import { round } from './numbers';
import config from '../config';

export const COORDS_MID_SAN_FRANCISCO = { lat: 37.7749, lng: -122.4194 };

export const coordsInSanFrancisco = (coords: any) => {
  // These are conservative bounds, extending into the ocean, the Bay, and Daly
  // City.
  const bb = {
    top: 37.820633,
    left: -122.562447,
    bottom: 37.688167,
    right: -122.326927,
  };
  return coords.lat > bb.bottom
    && coords.lat < bb.top
    && coords.lng > bb.left
    && coords.lng < bb.right;
};


/**
 * Get location via HTML5 Geolocation API.
 */
export const getLocationBrowser = () => new Promise((resolve, reject) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const coords = {
        lat: round(position.coords.latitude, 4),
        lng: round(position.coords.longitude, 4),
      };
      if (coordsInSanFrancisco(coords)) {
        resolve(coords);
      } else {
        const msg = `User location out of bounds: ${coords.lat},${coords.lng}`;
        console.log(msg);
        reject(msg);
      }
    }, error => {
      console.log(error);
      reject(error);
    });
  } else {
    const msg = 'Geolocation is not supported by this browser.';
    console.log(msg);
    reject(msg);
  }
});


/**
 * Get location via the Google Maps Geolocation API.
 */
export const getLocationGoogle = () => new Promise((resolve, reject) => {
  // Results are not very accurate
  let url = 'https://www.googleapis.com/geolocation/v1/geolocate';
  if (config.GOOGLE_API_KEY) {
    url += `?key=${config.GOOGLE_API_KEY}`;
  }
  fetch(url, { method: 'post' }).then(r => r.json())
    .then(data => {
      if (coordsInSanFrancisco(data.location)) {
        resolve(data.location);
      } else {
        const msg = 'User location out of bounds';
        console.log(msg);
        reject(msg);
      }
    })
    .catch(reject);
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
export const getLocation = () => getLocationBrowser()
  .catch(() => getLocationGoogle());
