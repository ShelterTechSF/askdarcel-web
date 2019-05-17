import { eligibilityActions as type } from 'actions/actionTypes';
import {
  getEligibilities,
  getFeaturedEligibilities,
  updateEligibilityFeatureRank,
} from '../api/eligibilityService';


export const getEligibilitiesAction = () => async dispatch => {
  try {
    dispatch({
      type: type.ELIGIBILITIES_LOAD_REQUEST,
    });
    const response = await getEligibilities();
    dispatch({
      type: type.ELIGIBILITIES_LOAD_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    dispatch({
      type: type.ELIGIBILITIES_LOAD_ERROR,
      payload: err,
    });
  }
};

export const getFeaturedEligibilitiesAction = () => async dispatch => {
  try {
    dispatch({
      type: type.FEATURED_ELIGIBILITIES_LOAD_REQUEST,
    });
    const response = await getFeaturedEligibilities();
    dispatch({
      type: type.FEATURED_ELIGIBILITIES_LOAD_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    dispatch({
      type: type.FEATURED_ELIGIBILITIES_LOAD_ERROR,
      payload: err,
    });
  }
};

export const updateEligibilityFeatureRankAction = (id, rank) => async dispatch => {
  try {
    dispatch({
      type: type.UPDATE_ELIGIBILITY_RANK_REQUEST,
    });
    const response = await updateEligibilityFeatureRank(id, rank);
    dispatch({
      type: type.UPDATE_ELIGIBILITY_RANK_SUCCESS,
      payload: response.data,
    });
  } catch (err) {
    dispatch({
      type: type.UPDATE_ELIGIBILITY_RANK_ERROR,
      payload: err,
    });
  }
};
