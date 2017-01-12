import * as types from '../actions/actionTypes';

const authHeaders = localStorage.getItem('access-token');

const isAuthenticated = authHeaders ? true : false;


const initialState = {
  isAuthenticated: isAuthenticated,
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
