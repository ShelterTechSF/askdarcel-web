import { routerReducer } from 'react-router-redux';
import services from './services';
import categories from './categories';
import organizations from './organizations';
import user from './user';
import auth from './auth';

export default {
  auth, // logged in state and permissions
  categories,
  organizations,
  routing: routerReducer,
  services,
  user, // Current user info and location
};
