
/* eslint-disable import/prefer-default-export */
export function adminLogin(email, password) {
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
