import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import thunkMiddleware from 'redux-thunk';
import { createBrowserHistory } from 'history';
import createRootReducer from '../reducers';

// Download redux dev tools here: https://github.com/zalmoxisus/redux-devtools-extension

export const history = createBrowserHistory();

export default function configureStore(initialState) {
  return createStore(
    createRootReducer(history),
    initialState,
    compose(
      applyMiddleware(routerMiddleware(history), reduxImmutableStateInvariant(), thunkMiddleware),
      window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
    ),
  );
}
