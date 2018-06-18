import { browserHistory } from 'react-router';
import * as types from './actionTypes';
import * as authApi from '../api/auth';

function adminLoginRequest() {
  return {
    type: types.ADMIN_LOGIN_REQUEST,
  };
}

function adminLoginSuccess() {
  return {
    type: types.ADMIN_LOGIN_SUCCESS,
  };
}

function adminLoginError() {
  return {
    type: types.ADMIN_LOGIN_ERROR,
  };
}

export default {
  adminLogin(email, password) {
    return (dispatch) => {
      dispatch(adminLoginRequest());
      authApi.adminLogin(email, password)
        .then((response) => {
          if (response.status === 200) {
            dispatch(adminLoginSuccess());
            const headers = response.headers;
            localStorage.setItem('authHeaders', JSON.stringify({
              'access-token': headers.get('access-token'),
              client: headers.get('client'),
              uid: headers.get('uid'),
            }));
            browserHistory.push('/admin/changes');
          } else if (response.status === 401) {
            alert('Incorrect email or password, please try again.');
            dispatch(adminLoginError());
          }
        })
        .catch((error) => {
          console.log('err', error);
        });
    };
  },
};
