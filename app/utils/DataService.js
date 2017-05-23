import * as _ from 'lodash/fp/object';

export function post(url, headers, changeRequestFields) {
  let payload = {};
  let body = {};
  if (changeRequestFields) {
    body['change_request'] = changeRequestFields;
  }

  let queryHeaders = {
    "Accept": "application/json",
    "Content-Type": "application/json"
  };
  if (headers) {
    queryHeaders = _.assignIn(queryHeaders, headers);
  }
  return fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: queryHeaders,
    body: JSON.stringify(body)
  }).then((resp) => {
    setAuthHeaders(resp);
    return resp;
  });
}

export function get(url, headers) {
  let queryHeaders = {
    "Content-Type": "application/json"
  };
  if (headers) {
    queryHeaders = _.assignIn(queryHeaders, headers);
  }
  return fetch(url, {
    method: 'GET',
    mode: 'cors',
    headers: queryHeaders
  }).then(resp => {
    setAuthHeaders(resp);
    return resp.json();
  });
}

function setAuthHeaders(resp) {
  let headers = resp.headers;
  if (headers.get('access-token') && headers.get('client')) {
    localStorage.setItem('authHeaders', JSON.stringify({
      "access-token": headers.get('access-token'),
      "client": headers.get('client'),
      "uid": headers.get('uid')
    }));
  }
}
