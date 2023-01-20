import * as _ from "lodash";

import type { VoteType } from "../components/listing/feedback/constants";

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
  body: any,
  headers?: HeadersInit
): Promise<Response> {
  let queryHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  if (headers) {
    queryHeaders = _.assignIn(queryHeaders, headers);
  }
  return fetch(url, {
    method: "POST",
    mode: "cors",
    headers: queryHeaders,
    body: JSON.stringify(body),
  }).then((resp) => {
    if (!resp.ok) {
      throw resp;
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
    queryHeaders = _.assignIn(queryHeaders, headers);
  }
  return fetch(url, {
    method: "GET",
    mode: "cors",
    headers: queryHeaders,
    credentials: "include",
  }).then((resp) => {
    if (!resp.ok) {
      throw resp;
    }
    setAuthHeaders(resp);
    return resp.json();
  });
}

export function put(
  url: RequestInfo | URL,
  body: any,
  headers: HeadersInit
): Promise<Response> {
  let queryHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  if (headers) {
    queryHeaders = _.assignIn(queryHeaders, headers);
  }
  return fetch(url, {
    method: "PUT",
    mode: "cors",
    headers: queryHeaders,
    body: JSON.stringify(body),
  }).then((resp) => {
    if (!resp.ok) {
      throw resp;
    }
    setAuthHeaders(resp);
    return resp;
  });
}

export function APIDelete(
  url: RequestInfo | URL,
  headers: HeadersInit
): Promise<void> {
  let queryHeaders = {
    "Content-Type": "application/json",
  };
  if (headers) {
    queryHeaders = _.assignIn(queryHeaders, headers);
  }
  return fetch(url, {
    method: "DELETE",
    mode: "cors",
    headers: queryHeaders,
  }).then((resp) => {
    if (!resp.ok) {
      throw resp;
    }
    setAuthHeaders(resp);
  });
}

interface FeedbackBody {
  rating: VoteType;
  tags: string[];
  review: string;
}

export const addFeedback = (
  source: "resources" | "services",
  sourceId: number,
  body: FeedbackBody
): Promise<Response> =>
  post(`/api/${source}/${sourceId}/feedbacks`, body).then((res) => res.json());

export const getResourceCount = (): Promise<number> =>
  get("/api/resources/count");
