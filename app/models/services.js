import ds from 'utils/DataService';

export const SERVICE_LOAD = 'SERVICE_LOAD';
export const SERVICE_LOAD_SUCCESS = 'SERVICE_LOAD_SUCCESS';
export const SERVICE_LOAD_ERROR = 'SERVICE_LOAD_ERROR';

export const SERVICES_LOAD = 'SERVICES_LOAD';

const initialState = {
  serviceList: [],
  activeService: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SERVICE_LOAD_SUCCESS: return { ...state, activeService: action.service };
    default: return state;
  }
}

// Get a service by ID
export function fetchService(id) {
  return async (dispatch) => {
    dispatch({ type: SERVICE_LOAD });
    try {
      const { service } = await ds.get(`/api/services/${id}`);
      dispatch({ type: SERVICE_LOAD_SUCCESS, service });
    } catch (err) {
      dispatch({ type: SERVICE_LOAD_ERROR, err });
    }
  };
}

// Get multiple services
export function fetchServices() {

}
