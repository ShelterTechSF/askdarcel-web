import { resourceActions as ACTIONS } from '../actions/resourceActions'

const initialState = {
  resource: null,
  resources: [],
  featuredResources: [],
  isVerified: false,
  isPending: false,
  errors: []
}

export default (state=initialState, action) => {

  switch(action.type){

    case ACTIONS.RESOURCE_LOAD_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case ACTIONS.RESOURCE_LOAD_SUCCESS:
      return {
        ...state,
        isFetching: false,
        resource: action.payload
      }
    case ACTIONS.RESOURCE_LOAD_ERROR:
      return {
        ...state,
        isFetching: false,
      }

    case ACTIONS.RESOURCES_LOAD_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case ACTIONS.RESOURCES_LOAD_SUCCESS:
      return {
        ...state,
        isFetching: false,
        resources: action.payload
      }
    case ACTIONS.RESOURCES_LOAD_ERROR:
      return {
        ...state,
        isFetching: false,
      }

      case ACTIONS.FEATURED_RESOURCES_LOAD_REQUEST:
        return {
          ...state,
          isFetching: true
        }
      case ACTIONS.FEATURED_RESOURCES_LOAD_SUCCESS:
        return {
          ...state,
          isFetching: false,
          resources: action.payload
        }
      case ACTIONS.FEATURED_RESOURCES_LOAD_ERROR:
        return {
          ...state,
          isFetching: false,
        }

    case ACTIONS.VERIFY_RESOURCE_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case ACTIONS.VERIFY_RESOURCE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isVerified: action.payload
      }
    case ACTIONS.VERIFY_RESOURCE_ERROR:
      return {
        ...state,
        isFetching: false,
      }

  case ACTIONS.RESOURCE_COUNT_LOAD_REQUEST:
    return {
      ...state,
      isFetching: true
    }
  case ACTIONS.RESOURCE_COUNT_LOAD_SUCCESS:
    return {
      ...state,
      isFetching: false,
      count: action.payload
    }
  case ACTIONS.RESOURCE_COUNT_LOAD_ERROR:
    return {
      ...state,
      isFetching: false,
    }

    case ACTIONS.RESOURCE_BY_CATEGORY_ID_LOAD_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case ACTIONS.RESOURCE_BY_CATEGORY_ID_LOAD_SUCCESS:
      return {
        ...state,
        isFetching: false,
        count: action.payload
      }
    case ACTIONS.RESOURCE_BY_CATEGORY_ID_LOAD_ERROR:
      return {
        ...state,
        isFetching: false,
      }

  case ACTIONS.RESOURCE_BY_CATEGORY_ID_LOAD_REQUEST:
    return {
      ...state,
      isFetching: true
    }
  case ACTIONS.RESOURCE_BY_CATEGORY_ID_LOAD_SUCCESS:
    return {
      ...state,
      isFetching: false,
      count: action.payload
    }
  case ACTIONS.RESOURCE_BY_CATEGORY_ID_LOAD_ERROR:
    return {
      ...state,
      isFetching: false,
    }


    default:
      return state

  }
}
