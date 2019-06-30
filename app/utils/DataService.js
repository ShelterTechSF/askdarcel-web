import * as _ from 'lodash/fp/object';

function setAuthHeaders(resp) {
  const { headers } = resp;
  if (headers.get('access-token') && headers.get('client')) {
    // console.log('we would set new auth headers except for an API bug giving us invalid tokens',
    //   headers.get('access-token'), headers.get('client')
    // )
    // localStorage.setItem('authHeaders', JSON.stringify({
    //   'access-token': headers.get('access-token'),
    //   client: headers.get('client'),
    //   uid: headers.get('uid'),
    // }));
  } else {
    // console.log('no new auth headers to set')
  }
}

export function post(url, body, headers) {
  let queryHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  if (headers) {
    queryHeaders = _.assignIn(queryHeaders, headers);
  }
  return fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: queryHeaders,
    body: JSON.stringify(body),
  }).then(resp => {
    if (!resp.ok) { throw resp; }
    setAuthHeaders(resp);
    return resp;
  });
}

export function get(url, headers) {
  let queryHeaders = {
    'Content-Type': 'application/json',
  };
  if (headers) {
    queryHeaders = _.assignIn(queryHeaders, headers);
  }
  return fetch(url, {
    method: 'GET',
    mode: 'cors',
    headers: queryHeaders,
    credentials: 'include',
  }).then(resp => {
    if (!resp.ok) { throw resp; }
    setAuthHeaders(resp);
    return resp.json();
  });
}

export function APIDelete(url, headers) {
  let queryHeaders = {
    'Content-Type': 'application/json',
  };
  if (headers) {
    queryHeaders = _.assignIn(queryHeaders, headers);
  }
  return fetch(url, {
    method: 'DELETE',
    mode: 'cors',
    headers: queryHeaders,
  }).then(resp => {
    if (!resp.ok) { throw resp; }
    setAuthHeaders(resp);
  });
}

/** Return a Promise with the fetched Resource. */
export const getResource = id => get(`/api/resources/${id}`)
  .then(({ resource }) => resource);

/** Return a Promise with the fetched Service. */
export const getService = id => get(`/api/services/${id}`)
  .then(({ service }) => service);
