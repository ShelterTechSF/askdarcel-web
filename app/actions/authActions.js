import * as types from './actionTypes';
import * as authApi from '../api/auth';
import { browserHistory } from 'react-router';

function adminLoginRequest() {
  return {
    type: types.ADMIN_LOGIN_REQUEST
  }
}

function adminLoginSuccess() {
  return {
    type: types.ADMIN_LOGIN_SUCCESS
  }
}


function adminLoginError() {
  return {
    type: types.ADMIN_LOGIN_ERROR
  }
}
export default {
  adminLogin(email, password){
    return dispatch => {
      dispatch(adminLoginRequest())
      authApi.adminLogin(email, password)
        .then(response => {
          if( response.status === 200) {
            dispatch(adminLoginSuccess());
            const headers = response.headers;

            localStorage.setItem('access-token', JSON.stringify(headers.get('access-token')));
            localStorage.setItem('client', JSON.stringify(headers.get('client')));
            localStorage.setItem('uid', JSON.stringify(headers.get('uid')));

            browserHistory.push('/testAuth');
          } else if( response.status === 401) {
            alert('Incorrect email or password, please try again.');
            dispatch(adminLoginError());
          }
        })
        .catch(error => {
          console.log('err', error);
        })
    }
  }
}