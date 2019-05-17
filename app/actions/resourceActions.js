import { resourceActions as type } from 'actions/actionTypes';
import {
  getResource,
  getResources,
  getFeaturedResources,
  getResourcesCount,
  getResourcesByCategoryId,
  searchForResources,
  getResourcesByIdSortByLoc,
  searchResourcesSortByLoc,
  verifyResource,
  certifyResourceHAP,
  deactivateResource,
} from '../api/resourceService';


export const getResourceAction = id => async dispatch => {
  try {
    dispatch({
      type: type.RESOURCE_LOAD_REQUEST,
    });
    const response = await getResource(id);
    dispatch({
      type: type.RESOURCE_LOAD_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    dispatch({
      type: type.RESOURCE_LOAD_ERROR,
      payload: err,
    });
  }
};

export const getResourcesAction = () => async dispatch => {
  try {
    dispatch({
      type: type.RESOURCES_LOAD_REQUEST,
    });
    const response = await getResources();
    dispatch({
      type: type.RESOURCES_LOAD_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    dispatch({
      type: type.RESOURCES_LOAD_ERROR,
      payload: err,
    });
  }
};

export const getFeaturedResourcesAction = () => async dispatch => {
  try {
    dispatch({
      type: type.FEATURED_RESOURCES_LOAD_REQUEST,
    });
    const response = await getFeaturedResources();
    dispatch({
      type: type.FEATURED_RESOURCES_LOAD_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    dispatch({
      type: type.FEATURED_RESOURCES_LOAD_ERROR,
      payload: err,
    });
  }
};

export const getResoucesCountAction = () => async dispatch => {
  try {
    dispatch({
      type: type.RESOURCE_COUNT_REQUEST,
    });
    const response = await getResourcesCount();
    dispatch({
      type: type.RESOURCE_COUNT_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    dispatch({
      type: type.RESOURCE_COUNT_ERROR,
      payload: err,
    });
  }
};

export const getResourcesByCategoryIdAction = categoryId => async dispatch => {
  try {
    dispatch({
      type: type.RESOURCES_BY_CATEGORY_ID_REQUEST,
    });
    const response = await getResourcesByCategoryId(categoryId);
    dispatch({
      type: type.RESOURCES_BY_CATEGORY_ID_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    dispatch({
      type: type.RESOURCES_BY_CATEGORY_ID_ERROR,
      payload: err,
    });
  }
};

export const searchForResourcesAction = query => async dispatch => {
  try {
    dispatch({
      type: type.SEARCH_FOR_RESOURCES_REQUEST,
    });
    const response = await searchForResources(query);
    dispatch({
      type: type.SEARCH_FOR_RESOURCES_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    dispatch({
      type: type.SEARCH_FOR_RESOURCES_ERROR,
      payload: err,
    });
  }
};

export const getResourcesByIdSortByLocAction = (id, lat, lon) => async dispatch => {
  try {
    dispatch({
      type: type.RESOURCES_BY_ID_SORT_LOC_LOAD_REQUEST,
    });
    const response = await getResourcesByIdSortByLoc(id, lat, lon);
    dispatch({
      type: type.RESOURCES_BY_ID_SORT_LOC_LOAD_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    dispatch({
      type: type.RESOURCES_BY_ID_SORT_LOC_LOAD_ERROR,
      payload: err,
    });
  }
};

export const searchResourcesSortByLocAction = (query, lat, lon) => async dispatch => {
  try {
    dispatch({
      type: type.SEARCH_RESOURCES_SORT_LOC_REQUEST,
    });
    const response = await searchResourcesSortByLoc(query, lat, lon);
    dispatch({
      type: type.SEARCH_RESOURCES_SORT_LOC_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    dispatch({
      type: type.SEARCH_RESOURCES_SORT_LOC_ERROR,
      payload: err,
    });
  }
};

// submit new service
// submit resource change
// add note to resource


export const verifyResourceAction = id => async dispatch => {
  try {
    dispatch({
      type: type.VERIFY_RESOURCE_REQUEST,
    });
    const response = await verifyResource(id);
    dispatch({
      type: type.VERIFY_RESOURCE_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    dispatch({
      type: type.VERIFY_RESOURCE_ERROR,
      payload: err,
    });
  }
};

export const certifyResourceAction = id => async dispatch => {
  try {
    dispatch({
      type: type.CERTIFY_RESOURCE_REQUEST,
    });
    const response = await certifyResourceHAP(id);
    dispatch({
      type: type.CERTIFY_RESOURCE_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    dispatch({
      type: type.CERTIFY_RESOURCE_ERROR,
      payload: err,
    });
  }
};

export const deactivateResourceAction = id => async dispatch => {
  try {
    dispatch({
      type: type.DEACTIVATE_RESOURCE_REQUEST,
    });
    const response = await deactivateResource(id);
    dispatch({
      type: type.DEACTIVATE_RESOURCE_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    dispatch({
      type: type.DEACTIVATE_RESOURCE_ERROR,
      payload: err,
    });
  }
};
