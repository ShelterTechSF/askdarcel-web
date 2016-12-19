import { combineReducers } from 'redux';
import resource from './resourceReducer';

const rootReducer = combineReducers({
  resource,
});

export default rootReducer;
