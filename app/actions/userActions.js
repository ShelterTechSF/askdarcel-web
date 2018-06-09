import * as types from './actionTypes';

export default {
  setUserLocation(location) {
    return {
      type: types.SET_USER_LOCATION,
      location,
    };
  },
};
