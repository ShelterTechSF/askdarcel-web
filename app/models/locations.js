// import { get } from 'utils/DataService';

const initialState = {};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    default: return state;
  }
}

// Turn a resource into a location - with schedule and address
export function parseLocationInformation(name, address, schedule) {
  return {
    id: address.id,
    address,
    name,
    schedule,
  };
}

// Not technically a redux action
export function checkIfInSanFrancisco(coords) {
  // These are conservative bounds, extending into the ocean, the Bay, and Daly
  // City.
  const bb = {
    top: 37.820633,
    left: -122.562447,
    bottom: 37.688167,
    right: -122.326927,
  };
  return coords.lat > bb.bottom &&
    coords.lat < bb.top &&
    coords.lng > bb.left &&
    coords.lng < bb.right;
}
