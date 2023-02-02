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

export function put(url, body, headers) {
  let queryHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  if (headers) {
    queryHeaders = _.assignIn(queryHeaders, headers);
  }
  return fetch(url, {
    method: 'PUT',
    mode: 'cors',
    headers: queryHeaders,
    body: JSON.stringify(body),
  }).then(resp => {
    if (!resp.ok) { throw resp; }
    setAuthHeaders(resp);
    return resp;
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

export const addFeedback = (source, sourceId, body) => (
  post(`/api/${source}/${sourceId}/feedbacks`, body).then(res => res.json())
);

export const getResourceCount = () => get('/api/resources/count');
