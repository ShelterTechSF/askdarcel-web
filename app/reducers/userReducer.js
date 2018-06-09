import * as types from '../actions/actionTypes';

const initialState = {
  location: {
    lat: 37.7749,
    lng: -122.4194,
  },
};


export default function resourceReducer(state = initialState, action) {
  switch (action.type) {
    case types.SET_USER_LOCATION:
      return (Object.assign({}, state, { location:
        Object.assign({}, state.location,
          { lat: action.location.lat, lng: action.location.lng }) })
      );
    default:
      return state;
  }
}
