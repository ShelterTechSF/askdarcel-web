import { createStore, applyMiddleware, compose } from 'redux';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';

// Download redux dev tools here: https://github.com/zalmoxisus/redux-devtools-extension

export default function configureStore(initialState) {
  return createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(reduxImmutableStateInvariant(), thunkMiddleware),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  );
}
