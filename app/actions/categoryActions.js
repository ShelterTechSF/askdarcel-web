import { categoryActions as type } from 'actions/actionTypes';
import {
  getCategories,
  getFeaturedCategories
} from '../api/categoryService';


export const getCategoriesAction = () => async dispatch => {
  try {
    dispatch({
      type: type.CATEGORIES_LOAD_REQUEST,
    });
    const response = await getCategories();
    dispatch({
      type: type.CATEGORIES_LOAD_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    dispatch({
      type: type.CATEGORIES_LOAD_ERROR,
      payload: err,
    });
  }
};

export const getFeaturedCategoriesAction = () => async dispatch => {
  try {
    dispatch({
      type: type.FEATURED_CATEGORIES_LOAD_REQUEST,
    });
    const response = await getFeaturedCategories();
    dispatch({
      type: type.FEATURED_CATEGORIES_LOAD_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    dispatch({
      type: type.FEATURED_CATEGORIES_LOAD_ERROR,
      payload: err,
    });
  }
};
