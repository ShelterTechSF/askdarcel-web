import api from './httpClient';

export const getService = id => api.get(`/services/${id}`);

export const getServicesByCategoryId = id => api.get(`/services?category_id=${id}`);

export const getServicesCount = () => api.get('/services/count');

// same as addServiceCategory?
export const submitServiceChangeRequest = (id, changeRequestObj) => api.post(`/services/${id}/change_requests`,
  {
    change_request: changeRequestObj,
  });

export const addNoteToService = (id, note) => api.post(`/services/${id}/notes`,
  { note });
