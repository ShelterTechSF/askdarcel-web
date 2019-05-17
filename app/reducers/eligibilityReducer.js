import { eligibilityActions as ACTIONS } from '../actions/eligibilityActions'

const initialState = {
  eligibilities: [],
  featuredEligibilities: [],
  updated: false,
  isPending: false,
  errors: []
}

export default (state=initialState, action) => {

  switch(action.type){

    case ACTIONS.ELIGIBILITIES_LOAD_REQUEST:
      return {
        ...state,
        isPending: true
      }
    case ACTIONS.ELIGIBILITIES_LOAD_SUCCESS:
      return {
        ...state,
        isPending: false,
        eligibilities: action.payload
      }
    case ACTIONS.ELIGIBILITIES_LOAD_ERROR:
      return {
        ...state,
        isPending: false,
      }

    case ACTIONS.FEATURED_ELIGIBILITIES_LOAD_REQUEST:
      return {
          ...state,
          isPending: true
      }
      case ACTIONS.FEATURED_ELIGIBILITIES_LOAD_SUCCESS:
      return {
          ...state,
          isPending: false,
          featuredEligibilities: action.payload
      }
      case ACTIONS.FEATURED_ELIGIBILITIES_LOAD_ERROR:
      return {
          ...state,
          isPending: false,
      }

      case ACTIONS.UPDATE_ELIGIBILITY_RANK_REQUEST:
        return {
          ...state,
          isPending: true
        }
      case ACTIONS.UPDATE_ELIGIBILITY_RANK_SUCCESS:
        return {
          ...state,
          eligibility: action.payload,
          isPending: false,
          updated: true
        }
      case ACTIONS.UPDATE_ELIGIBILITY_RANK_ERROR:
        return {
          ...state,
          isPending: false,
        }

    default:
      return state

  }
}
