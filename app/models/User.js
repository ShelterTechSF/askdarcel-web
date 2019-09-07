// Actions
export const ACTIONS = {
  SET_USER_LOCATION: 'SET_USER_LOCATION',
};

const initialState = {
  location: {
    lat: 37.7749,
    lng: -122.4194,
  },
};

export function REDUCER(state = initialState, action) {
  switch (action.type) {
    case ACTIONS.SET_USER_LOCATION:
      return {
        ...state,
        location: {
          ...state.location,
          lat: action.location.lat,
          lng: action.location.lng,
        },
      };

    default:
      return state;
  }
}

export function setUserLocation(location) {
  return {
    type: ACTIONS.SET_USER_LOCATION,
    location,
  };
}
