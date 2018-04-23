import ds from 'utils/DataService';

const ADMIN_LOGIN = 'ADMIN_LOGIN';
const ADMIN_LOGIN_SUCCESS = 'ADMIN_LOGIN_SUCCESS';
const ADMIN_LOGIN_FAIL = 'ADMIN_LOGIN_FAIL';

const authHeaders = JSON.parse(localStorage.getItem('authHeaders'));

const initialState = {
  isAuthenticated: !!(authHeaders && authHeaders['access-token'] && authHeaders.client),
  isFetching: false,
  loginError: null,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case ADMIN_LOGIN:
      return Object.assign({}, state, { isFetching: true });
    case ADMIN_LOGIN_SUCCESS:
      return Object.assign({}, state, { isAuthenticated: true, isFetching: false });
    case ADMIN_LOGIN_FAIL:
      return Object.assign({}, state, { isFetching: false, adminLoginError: action.error });
    default:
      // TODO Update state for all red
      return state;
  }
}

// function adminLoginRequest() {
//   return {
//     type: types.ADMIN_LOGIN_REQUEST,
//   };
// }

// function adminLoginSuccess() {
//   return {
//     type: types.ADMIN_LOGIN_SUCCESS,
//   };
// }

// function adminLoginError() {
//   return {
//     type: types.ADMIN_LOGIN_ERROR,
//   };
// }

export function login(email, password) {
  console.log('attempting to login', email, password);
  return async (dispatch) => {
    try {
      const session = await ds.post('/api/admin/auth/sign_in', { email, password }, {  });
      console.log(session);
    } catch (err) {
      dispatch({ type: ADMIN_LOGIN_FAIL, err });
      console.error(err);
    }
  };
}

export function logout () {

}

export function adminLogin(email, password) {
  // console.log('em psw', email, password);
  return fetch('/api/admin/auth/sign_in', {
    method: 'post',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

// export default {
//   adminLogin(email, password) {
//     return dispatch => {
//       dispatch(adminLoginRequest());
//       adminLogin(email, password)
//         .then(response => {
//           if ( response.status === 200) {
//             dispatch(adminLoginSuccess());
//             const headers = response.headers;
//             localStorage.setItem('authHeaders', JSON.stringify({
//               'access-token': headers.get('access-token'),
//               client: headers.get('client'),
//               uid: headers.get('uid'),
//             }));
//             browserHistory.push('/admin/changes');
//           } else if (response.status === 401) {
//             alert('Incorrect email or password, please try again.');
//             dispatch(adminLoginError());
//           }
//         })
//         .catch(error => {
//           console.log('err', error);
//         })
//     }
//   }
// }
