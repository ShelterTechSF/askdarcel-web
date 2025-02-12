import { LocationDetails, TransformedSearchHit } from "models";

//  TODO: Refactor SearchMap so that both maps create markers from a list of locations, not from hits

export const groupHitsByLocation = (hits: TransformedSearchHit[]) => {
  return hits.reduce((acc, hit) => {
    hit.locations.forEach((location) => {
      const key = `${location.lat}-${location.long}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push({ hit, location });
    });
    return acc;
  }, {} as Record<string, { hit: TransformedSearchHit; location: { id: string; lat: string; long: string; label: string } }[]>);
};

export const groupServiceLocations = (locations: LocationDetails[]) => {
  return locations.reduce((acc, location, i) => {
    const key = `${location.address.latitude}-${location.address.longitude}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push({ location, markerIndex: i + 1 });
    return acc;
  }, {} as Record<string, { location: LocationDetails; markerIndex: number }[]>);
};

/*
    Input: Current index, total number of items at a location, and that location's coordinates 
    Output: A new set of coordinates for the current item as its place on a grid. Meant to be run on multiple values. Items will be evenly spaced apart and the epicenter will be at the direct center of the grid.
*/
export const computeGridOffset = (
  index: number,
  total: number,
  epicenterCoords: {
    lat: number;
    lng: number;
  }
): { offsetLat: number; offsetLng: number } => {
  const SPACING = 0.00004;
  const cols = Math.ceil(Math.sqrt(total));
  // if not a perfect square, round up as an extra row for the remainder items
  const rows = Math.ceil(total / cols);
  // determine current item's row and column by its index (it will be the only item at this grid position)
  const row = Math.floor(index / cols);
  const col = index % cols;
  // create new coordinates based on item's row and column position
  const offsetLat = epicenterCoords.lat + (row - (rows - 1) / 2) * SPACING;
  const offsetLng = epicenterCoords.lng + (col - (cols - 1) / 2) * SPACING;
  return { offsetLat, offsetLng };
};
