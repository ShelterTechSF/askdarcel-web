import { combineReducers } from 'redux';
import { combineForms } from 'react-redux-form';
import { routerReducer } from 'react-router-redux';
import resource from './resourceReducer';
import services from './serviceReducer';
import auth from './authReducer';
import changeRequestReducer from './changeRequestReducer';
import popUpMessageReducer from './popUpMessageReducer';
import forms from './formConfig';

import { User } from '../models';

const rootReducer = combineReducers({
  auth,
  changeRequestReducer,
  forms: combineForms(forms, 'forms'),
  popUpMessage: popUpMessageReducer,
  resource,
  routing: routerReducer,
  services,
  user: User.REDUCER,
});

export default rootReducer;
