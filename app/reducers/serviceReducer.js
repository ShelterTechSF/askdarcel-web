import * as types from '../actions/actionTypes';

const initialState = {
  serviceList: [],
  activeService: null,
};

export default function servicesReducer(state = initialState, action) {
  switch (action.type) {
    case types.SERVICE_LOAD_SUCCESS:
      return { ...state, activeService: action.service };
    default:
      return state;
  }
}
