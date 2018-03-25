

export function adminLogin(email, password) {
  // console.log('em psw', email, password);
  return fetch('/api/admin/auth/sign_in', {
    method: 'post',
    headers: {
      "Content-type": "application/json",
    },
    credentials: 'include',
    body: JSON.stringify({
      email,
      password
    })
  })
}
