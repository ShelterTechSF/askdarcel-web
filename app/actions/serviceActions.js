import {
  SERVICE_LOAD_REQUEST, SERVICE_LOAD_SUCCESS, SERVICE_LOAD_ERROR, SERVICES_LOAD_REQUEST,
} from 'actions/actionTypes';
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


import { serviceActions as type } from 'actions/actionTypes';
import {
    getService,
    getServicesByCategoryId,
    getServicesCount,
    submitServiceChangeRequest,
    addNoteToService
} from '../api/serviceService';

export const getServiceAction = (id) => async dispatch => {
  try {
    dispatch({
      type: type.SERVICE_LOAD_REQUEST,
    });
    const response = await getService(id);
    dispatch({
      type: type.SERVICE_LOAD_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    dispatch({
      type: type.SERVICE_LOAD_ERROR,
      payload: err,
    });
  }
};

export const getServicesByCategoryIdAction = (categoryId) => async dispatch => {
  try {
    dispatch({
      type: type.SERVICES_BY_CATEGORY_LOAD_REQUEST,
    });
    const response = await getServicesByCategoryId(categoryId);
    dispatch({
      type: type.SERVICES_BY_CATEGORY_LOAD_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    dispatch({
      type: type.SERVICES_BY_CATEGORY_LOAD_ERROR,
      payload: err,
    });
  }
};

export const getServicesCountAction = () => async dispatch => {
  try {
    dispatch({
      type: type.SERVICES_COUNT_REQUEST,
    });
    const response = await getServicesCount();
    dispatch({
      type: type.SERVICES_COUNT_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    dispatch({
      type: type.SERVICES_COUNT_ERROR,
      payload: err,
    });
  }
};

export const submitServiceChangeRequestAction = (id, changeRequestObj) => async dispatch => {
  try {
    dispatch({
      type: type.SERVICES_CHANGE_REQUEST_REQUEST,
    });
    const response = await submitServiceChangeRequest(id, changeRequestObj);
    dispatch({
      type: type.SERVICES_CHANGE_REQUEST_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    dispatch({
      type: type.SERVICES_CHANGE_REQUEST_ERROR,
      payload: err,
    });
  }
};

export const addNoteToServiceAction = (id, note) => async dispatch => {
  try {
    dispatch({
      type: type.ADD_NOTE_TO_SERVICE_REQUEST,
    });
    const response = await addNoteToService(id, note);
    dispatch({
      type: type.ADD_NOTE_TO_SERVICE_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    dispatch({
      type: type.ADD_NOTE_TO_SERVICE_ERROR,
      payload: err,
    });
  }
};
