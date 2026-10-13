import { GeoCoordinates } from "./location";

const EARTH_RADIUS_MILES = 3958.8;

const degreesToRadians = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

/*
 * Distance in miles between two coordinates.
 *
 * Uses the Equirectangular approximation. Inside San Francisco the worst-case
 * error is less than a foot compared to the Haversine formula. The Haversine
 * formula is a more accurate choice for much larger distances.
 *
 * https://www.movable-type.co.uk/scripts/latlong.html
 */
export const distanceInMiles = (from: GeoCoordinates, to: GeoCoordinates): number => {
  const meanLat = degreesToRadians((from.lat + to.lat) / 2);
  const x = degreesToRadians(to.lng - from.lng) * Math.cos(meanLat);
  const y = degreesToRadians(to.lat - from.lat);
  return Math.sqrt(x * x + y * y) * EARTH_RADIUS_MILES;
};
