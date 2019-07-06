import api from './httpClient';


export const getResource = id => api.get(`/resources/${id}`);

export const getResources = () => api.get('/resources?category_id=all');

export const getFeaturedResources = () => api.get('/resources');

export const getResourcesCount = () => api.get('/resources/count');

export const getResourcesByCategoryId = categoryID => api.get(`/resources?category_id=${categoryID}`);

export const searchForResources = query => api.get(`/resources/search?query=${query}`);

export const getResourcesByIdSortByLoc = (id, lat, lon) => api.get(`/resources?category_id=${id}&lat=${lat}&long=${lon}`);

export const searchResourcesSortByLoc = (query, lat, lon) => api.get(`/resources/search?query=${query}&lat=${lat}&long=${lon}`);

export const submitEdits = promises => {
  return axios.all(promises).then((response) => {
    return response.reduce((acc,cur) => {
      acc.push(cur.data)
      return acc
    },[])
  })
}

export const submitNewResource = resource => {
  return api.post('/resources', { resources: [resource] })
}

export const submitNewService = (resourceId, service) => {
  api.post(`/resources/${resourceId}/services`,
  { services: service });
}

export const submitResourceChangeRequest = (id, changeRequestObj) => api.post(`/resources/${id}/change_requests`,
  { change_request: changeRequestObj });

export const addNoteToResource = (id, note) => api.post(`/resources/${id}/notes`,
  { note });

export const verifyResource = id => {
  const changeRequest = { verified_at: new Date().toISOString() };
  return api.post(`/resources/${id}/change_requests`,
    { change_request: changeRequest });
};

export const certifyResourceHAP = id => {
  api.post(`/resources/${id}/certify`);
};

export const deactivateResource = id => api.delete(`/resources/${id}`);
