import promiseMiddleware from 'redux-promise-middleware';
import {
  PENDING, FULFILLED, REJECTED, addRecurSchedToResource,
} from './utils';
import { getResource, submitChangeRequests } from '../api/resourceService';

const initialState = {
  isPending: false,
  resource: {},
  isNewResource: false,
  error: {},
};

export const ACTIONS = {
  GET_RESOURCE: 'GET_RESOURCE',
  SET_NEW_RESOURCE: 'SET_NEW_RESOURCE',
  UPDATE_RESOURCE: 'UPDATE_RESOURCE',
};

export function REDUCER(state = initialState, action) {
  switch (action.type) {
  case PENDING(ACTIONS.GET_RESOURCE):
    return {
      ...state,
      isPending: true,
    };

  case FULFILLED(ACTIONS.GET_RESOURCE):
    return {
      ...state,
      isPending: false,
      // resource:  Object.assign({}, {})//addRecurSchedToResource(action.payload.data.resource) //RENAME FN
      resource: addRecurSchedToResource(action.payload.data.resource), // RENAME FN
    };

  case REJECTED(ACTIONS.GET_RESOURCE):
    return {
      ...state,
      isPending: false,
      error: action.payload,
    };


  case PENDING(ACTIONS.UPDATE_RESOURCE):
    return {
      ...state,
      isPending: true,
    };

  case FULFILLED(ACTIONS.UPDATE_RESOURCE):
    return {
      ...state,
      isPending: false,
      // resource: action.payload
    };

  case REJECTED(ACTIONS.UPDATE_RESOURCE):
    return {
      ...state,
      isPending: false,
      error: action.payload,
    };

  default:
    return state;
  }
}


export const getResourceAction = id => ({
  type: ACTIONS.GET_RESOURCE,
  payload: getResource(id),
});

export const updateResourceAction = promises => ({
  type: ACTIONS.UPDATE_RESOURCE,
  payload: submitChangeRequests(promises),
});
