import * as _ from 'lodash/fp/object';

function setAuthHeaders(resp) {
  const headers = resp.headers;
  if (headers.get('access-token') && headers.get('client')) {
    // console.log('we would set new auth headers except for an API
    // bug giving us invalid tokens', headers.get('access-token'), headers.get('client'))
    // localStorage.setItem('authHeaders', JSON.stringify({
    //   'access-token': headers.get('access-token'),
    //   client: headers.get('client'),
    //   uid: headers.get('uid'),
    // }));
  } else {
    // console.log('no new auth headers to set')
  }
}

class DataService {
  constructor(defaultHeaders) {
    this.defaultHeaders = defaultHeaders;
  }

  get(url, headers = {}) {
    return fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        ...this.defaultHeaders,
        ...headers,
      },
    }).then((resp) => {
      if (!resp.ok) { throw resp; }
      setAuthHeaders(resp);
      return resp.json();
    });
  }

  post(url, body, headers = {}) {
    return fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        ...headers,
        ...this.defaultHeaders,
      },
      body: JSON.stringify(body),
    }).then((resp) => {
      if (!resp.ok) { throw resp; }
      setAuthHeaders(resp);
      return resp;
    });
  }

  delete(url, headers = {}) {
    return fetch(url, {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        ...this.defaultHeaders,
        ...headers,
      },
    }).then((resp) => {
      if (!resp.ok) { throw resp; }
      setAuthHeaders(resp);
    });
  }
}

const ds = new DataService({
  'Content-Type': 'application/json',
});

export default ds;
