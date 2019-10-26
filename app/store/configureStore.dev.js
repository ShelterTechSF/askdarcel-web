import { createStore, applyMiddleware, compose } from 'redux';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import thunkMiddleware from 'redux-thunk';
import promise from 'redux-promise-middleware';
import rootReducer from '../reducers';

// Download redux dev tools here: https://github.com/zalmoxisus/redux-devtools-extension

const middleware = [
  reduxImmutableStateInvariant(), // FIXME: consider adding immutableJS
  thunkMiddleware,
  promise,
];

export default function configureStore(initialState) {
  return createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(...middleware),
      window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
    ),
  );
}
