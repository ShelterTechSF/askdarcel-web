import * as types from '../actions/actionTypes';

const authHeaders = JSON.parse(localStorage.getItem('authHeaders'));

const isAuthenticated = !!(authHeaders && authHeaders['access-token'] && authHeaders.client);


const initialState = {
  isAuthenticated,
  isFetching: false,
  adminLoginError: '',

};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case types.ADMIN_LOGIN_REQUEST:
      return Object.assign({}, state, { isFetching: true });
    case types.ADMIN_LOGIN_SUCCESS:
      return Object.assign({}, state, { isAuthenticated: true, isFetching: false });
    case types.ADMIN_LOGIN_ERROR:
      return Object.assign({}, state, { isFetching: false, adminLoginError: action.error });
    default:
      return state;
  }
}
