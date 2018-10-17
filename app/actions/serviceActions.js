import { SERVICE_LOAD_REQUEST, SERVICE_LOAD_SUCCESS, SERVICE_LOAD_ERROR, SERVICES_LOAD_REQUEST } from 'actions/actionTypes';
import { get } from 'utils/DataService';

export function fetchService(id) {
  return dispatch => {
    dispatch({ type: SERVICE_LOAD_REQUEST });
    return get(`/api/services/${id}`).then(resp => {
      const { service } = resp;
      dispatch({ type: SERVICE_LOAD_SUCCESS, service });
    }).catch(e => {
      dispatch({ type: SERVICE_LOAD_ERROR, e });
    });
  };
}

export function fetchServices() {
  return dispatch => {
    dispatch({ type: SERVICES_LOAD_REQUEST });
  };
}
