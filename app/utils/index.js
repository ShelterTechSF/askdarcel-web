export function getAuthRequestHeaders() {
  let authHeaders = localStorage;

  return {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "access-token": JSON.parse(authHeaders['access-token']),
        "client": JSON.parse(authHeaders.client),
        "uid": JSON.parse(authHeaders.uid)
      };
}