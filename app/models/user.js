import ds from 'utils/DataService';

const USER_GET_LOCATION = 'USER_GET_LOCATION';
const USER_GET_LOCATION_SUCCESS = 'USER_GET_LOCATION_SUCCESS';
const USER_GET_LOCATION_FAIL = 'USER_GET_LOCATION_FAIL';

const initialState = {
  session: null,
  location: { lat: undefined, lng: undefined },
};

const { GOOGLE_API_KEY } = CONFIG;
const gapiQuery = GOOGLE_API_KEY ? `?key=${GOOGLE_API_KEY}` : '';

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case USER_GET_LOCATION_FAIL:
    case USER_GET_LOCATION_SUCCESS:
      return { ...state, location: action.location };
    default: return state;
  }
}

// Calculate the current users location, first through geolocation,
// fall back on gmaps, finally default to SF
export function getUserLocation() {
  return async (dispatch) => {
    dispatch({ type: USER_GET_LOCATION });
    try {
      const getUserLocationFromGoogle = async () => {
        const resp = await ds.post(`https://www.googleapis.com/geolocation/v1/geolocate${gapiQuery}`);
        const coords = await resp.json();
        return { ...coords.location, src: 'google' };
      };

      const location = await new Promise((resolve) => {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            // Success, use native geolocation
            position => resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              src: 'geolocation',
            }),
            // Failure, try google geolocation
            () => {
              console.warn('failed native geolocation, falling back on google');
              resolve(getUserLocationFromGoogle());
            },
            // Give up on geolocation after 5 seconds, and cache for 2 mins
            { timeout: 5000, maximumAge: 120000 },
          );
        } else {
          resolve(getUserLocationFromGoogle());
        }
      });
      dispatch({ type: USER_GET_LOCATION_SUCCESS, location });
    } catch (err) {
      console.warn('location tracking failed, defaulting to SF', err);
      // Default to San Francisco
      dispatch({ type: USER_GET_LOCATION_FAIL, err, location: { lat: 37.7749, lng: -122.4194, src: 'defaulttosf' } });
    }
  };
}
