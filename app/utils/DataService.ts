import assignIn from "lodash.assignin";

function setAuthHeaders(resp: Response): void {
  const { headers } = resp;
  if (headers.get("access-token") && headers.get("client")) {
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

export function post(
  url: RequestInfo | URL,
  body?: any,
  headers?: HeadersInit
): Promise<Response> {
  let queryHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  if (headers) {
    queryHeaders = assignIn(queryHeaders, headers);
  }
  return fetch(url, {
    method: "POST",
    mode: "cors",
    headers: queryHeaders,
    body: JSON.stringify(body),
  }).then((resp) => {
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
    setAuthHeaders(resp);
    return resp;
  });
}

export function get(
  url: RequestInfo | URL,
  headers?: HeadersInit
): Promise<any> {
  let queryHeaders = {
    "Content-Type": "application/json",
  };
  if (headers) {
    queryHeaders = assignIn(queryHeaders, headers);
  }
  return fetch(url, {
    method: "GET",
    mode: "cors",
    headers: queryHeaders,
    credentials: "include",
  }).then((resp) => {
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
    setAuthHeaders(resp);
    return resp.json();
  });
}

// Devs should note that Shelter Tech's endpoint is a thin wrapper over the Google Cloud SDK for ruby. If we were
// to procure the credentials we could call Google's translation service directly.
export function translate(
  text: string,
  sourceLanguage: string
): Promise<string> {
  return post("/api/translation/translate_text", {
    text,
    source_language: sourceLanguage,
  })
    .then((resp) => resp.json().then((body) => body.result))
    .catch((error) => error);
}
