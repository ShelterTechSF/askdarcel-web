import * as _ from 'lodash/fp/object';
import axios from 'axios';
import { parseAPISchedule } from './transformSchedule';

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
  // FIXME: use config headers
  return axios.post(url, body, headers).then(res => res.data);
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


const shouldInheritSchedule = service => (
  service.schedule && service.schedule.schedule_days.length > 0
);

/**
 * Return a Promise with the fetched Resource.
 *
 * Also perform a transformation from the raw API representation of schedules
 * into a nicer-to-use data model of RecurringSchedules.
 */
export const getResource = id => get(`/api/resources/${id}`)
  .then(({ resource }) => {
    const recurringSchedule = parseAPISchedule(resource.schedule);
    const services = resource.services.map(service => {
      const scheduleRecurringSchedule = shouldInheritSchedule(service)
        ? parseAPISchedule(service.schedule)
        : recurringSchedule;
      return {
        ...service,
        recurringSchedule: scheduleRecurringSchedule,
      };
    });
    return {
      ...resource,
      recurringSchedule,
      services,
    };
  });

/**
 * Return a Promise with the fetched Service.
 *
 * Also perform a transformation from the raw API representation of schedules
 * into a nicer-to-use data model of RecurringSchedules.
 */
export const getService = id => get(`/api/services/${id}`)
  .then(({ service }) => {
    const recurringSchedule = shouldInheritSchedule(service)
      ? parseAPISchedule(service.schedule)
      : parseAPISchedule(service.resource.schedule);
    return (
      {
        ...service,
        recurringSchedule,
      }
    );
  });
