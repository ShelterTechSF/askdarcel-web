import * as types from '../actions/actionTypes';

const initialState = {
  serviceList: [],
  activeService: null,
};

export default function servicesReducer(state = initialState, action) {
  switch (action.type) {
  case types.SERVICE_LOAD_SUCCESS:
    return { ...state, activeService: action.service };
  default:
    return state;
  }
}

//
// import { serviceActions as ACTIONS } from '../actions/serviceActions'
//
// const initialState = {
//   service: null,
//   serviceList: [],
//   count: 0,
//   isUpdated: false,
//   isPending: false,
//   errors: []
// }
//
// export default (state=initialState, action) => {
//
//   switch(action.type){
//
//     case ACTIONS.SERVICE_LOAD_REQUEST:
//       return {
//         ...state,
//         isPending: true
//       }
//     case ACTIONS.SERVICE_LOAD_SUCCESS:
//       return {
//         ...state,
//         isPending: false,
//         serviceList: action.payload
//       }
//     case ACTIONS.SERVICE_LOAD_ERROR:
//       return {
//         ...state,
//         isPending: false,
//       }
//
//     case ACTIONS.SERVICES_BY_CATEGORY_LOAD_REQUEST:
//       return {
//           ...state,
//           isPending: true
//       }
//       case ACTIONS.SERVICES_BY_CATEGORY_LOAD_SUCCESS:
//       return {
//           ...state,
//           isPending: false,
//           servicesList: action.payload
//       }
//       case ACTIONS.SERVICES_BY_CATEGORY_LOAD_ERROR:
//       return {
//           ...state,
//           isPending: false,
//       }
//
//       case ACTIONS.SERVICES_COUNT_REQUEST:
//         return {
//           ...state,
//           isPending: true
//         }
//       case ACTIONS.SERVICES_COUNT_SUCCESS:
//         return {
//           ...state,
//           count: action.payload,
//           isPending: false
//         }
//       case ACTIONS.SERVICES_COUNT_ERROR:
//         return {
//           ...state,
//           isPending: false,
//         }
//
//         case ACTIONS.SERVICES_CHANGE_REQUEST_REQUEST:
//           return {
//             ...state,
//             isPending: true
//           }
//         case ACTIONS.SERVICES_CHANGE_REQUEST_SUCCESS:
//           return {
//             ...state,
//             isUpdated: true,
//             isPending: false
//           }
//         case ACTIONS.SERVICES_CHANGE_REQUEST_ERROR:
//           return {
//             ...state,
//             isPending: false,
//           }
//
//           case ACTIONS.ADD_NOTE_TO_SERVICE_REQUEST:
//             return {
//               ...state,
//               isPending: true
//             }
//           case ACTIONS.ADD_NOTE_TO_SERVICE_SUCCESS:
//             return {
//               ...state,
//               isUpdated: true,
//               isPending: false
//             }
//           case ACTIONS.ADD_NOTE_TO_SERVICE_ERROR:
//             return {
//               ...state,
//               isPending: false,
//             }
//
//     default:
//       return state
// 
//   }
// }
