import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router';
import configureStore from './store/configureStore';
import { Provider } from 'react-redux';

import router from './router';

require('./styles/main.scss');

const store = configureStore();

ReactDOM.render((
  <Provider store={store}>
    {router}
  </Provider>
), document.getElementById('root'));
