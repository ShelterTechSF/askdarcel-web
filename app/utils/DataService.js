import * as _ from 'lodash/fp/object';
import config from '../../config';

function setAuthHeaders(resp) {
  const headers = resp.headers;
  if (headers.get('access-token') && headers.get('client')) {
    // console.log('we would set new auth headers except for an API bug giving us invalid tokens', headers.get('access-token'), headers.get('client'))
    // localStorage.setItem('authHeaders', JSON.stringify({
    //   'access-token': headers.get('access-token'),
    //   client: headers.get('client'),
    //   uid: headers.get('uid'),
    // }));
  } else {
    // console.log('no new auth headers to set')
  }
}

function request(method, reqUrl, reqHeaders = {}, body) {
  let url;

  if (config.api) {
    url = config.api + reqUrl;
  } else {
    url = reqUrl;
  }

  const headers = Object.assign({
    'Content-Type': 'application/json',
  }, reqHeaders);

  const requestParams = Object.assign({
    headers,
    method,
    mode: 'cors',
    body,
  });

  return fetch(url, requestParams).then((resp) => {
    if (!resp.ok) { throw resp; }
    setAuthHeaders(resp);
    return resp.json();
  });
}

export function post(url, body, headers) {
  console.log(url)
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
  }).then((resp) => {
    if (!resp.ok) { throw resp; }
    setAuthHeaders(resp);
    return resp;
  });
}

export function get(url, headers = {}) {
  return request('GET', url, headers);
  // console.log(url)
  // let queryHeaders = {
  //   'Content-Type': 'application/json',
  // };
  // if (headers) {
  //   queryHeaders = _.assignIn(queryHeaders, headers);
  // }
  // return fetch(url, {
  //   method: 'GET',
  //   mode: 'cors',
  //   headers: queryHeaders,
  // }).then((resp) => {
  //   if (!resp.ok) { throw resp; }
  //   setAuthHeaders(resp);
  //   return resp.json();
  // });
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
  }).then((resp) => {
    if (!resp.ok) { throw resp; }
    setAuthHeaders(resp);
  });
}
