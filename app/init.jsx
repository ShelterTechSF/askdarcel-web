import React from 'react';
import ReactGA from 'react-ga';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from './store/configureStore';
import routes from './routes';
import 'instantsearch.css/themes/reset.css';

require('./styles/main.scss');

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

if (NODE_ENV === 'production') {
  ReactGA.initialize('UA-116318550-1');
  history.listen((loc) => {
    const page = loc.pathname + loc.search;
    ReactGA.set({ page });
    ReactGA.pageview(loc.pathname);
  });
}


ReactDOM.render((
  <Provider store={store} key="provider">
    <Router history={history}>
      {routes}
    </Router>
  </Provider>
), document.getElementById('root'));
