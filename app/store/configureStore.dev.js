import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../models';

// Download redux dev tools here: https://github.com/zalmoxisus/redux-devtools-extension

export default function configureStore(initialState) {
  return createStore(
    combineReducers({ ...rootReducer }),
    initialState,
    compose(
      applyMiddleware(reduxImmutableStateInvariant(), thunkMiddleware),
      window.devToolsExtension ? window.devToolsExtension() : f => f,
    ),
  );
}
