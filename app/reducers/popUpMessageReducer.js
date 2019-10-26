import * as types from '../actions/actionTypes';

const initialState = {
  message: '',
  type: 'success',
  visible: false,
};

export default function popUpMessageReducer(state = initialState, action) {
  switch (action.type) {
  case types.SHOW_POP_UP_MESSAGE: {
    const { message, type } = action.popUpMessage;
    return {
      ...state,
      message,
      type,
      visible: true,
    };
  }
  case types.HIDE_POP_UP_MESSAGE:
    return {
      ...state,
      visible: false,
    };
  default:
    return state;
  }
}
