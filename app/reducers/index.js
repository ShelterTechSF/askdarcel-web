import { combineReducers } from 'redux';
import { combineForms } from 'react-redux-form';
import { connectRouter } from 'connected-react-router';
import resource from './resourceReducer';
import services from './serviceReducer';
import auth from './authReducer';
import changeRequestReducer from './changeRequestReducer';
import popUpMessageReducer from './popUpMessageReducer';
import forms from './formConfig';

import { User } from '../models';

const createRootReducer = history => combineReducers({
  auth,
  changeRequestReducer,
  forms: combineForms(forms, 'forms'),
  popUpMessage: popUpMessageReducer,
  resource,
  router: connectRouter(history),
  services,
  user: User.REDUCER,
});

export default createRootReducer;
