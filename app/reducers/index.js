import { combineReducers } from 'redux';
import { combineForms } from 'react-redux-form';
import { routerReducer } from 'react-router-redux';
import services from './serviceReducer';
import auth from './authReducer';
import changeRequestReducer from './changeRequestReducer';
import popUpMessageReducer from './popUpMessageReducer';
import forms from './formConfig';

import { User, Resource } from '../models';

const rootReducer = combineReducers({
  auth,
  changeRequestReducer,
  forms: combineForms(forms, 'forms'),
  popUpMessage: popUpMessageReducer,
  routing: routerReducer,
  services,
  user: User.REDUCER,
  resource: Resource.REDUCER,
});

export default rootReducer;
