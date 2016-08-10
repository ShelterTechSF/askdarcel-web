import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router';

import App from './components/App';
import CategoryPage from './components/CategoryPage';
import ResourcesTable from './components/Resources/ResourcesTable';
import Resource from './components/Resource/Resource';
import EditResource from './components/Resource/EditResource';
import Google from './utils/google';

require('./styles/main.scss');

function redirectToRoot (nextState, replace) {
  replace({
    pathname: '/',
  });
};


ReactDOM.render((
  <Router history={ browserHistory }>
    <Route path="/" component={ App } >
      <IndexRoute component={ CategoryPage } />
      <Route name="resources" path="/resources" component={ ResourcesTable } />
      <Route name="editResource" path="resource/edit" component={ EditResource } />
      <Route name="resource" path="/resource" component={ Resource } />
      <Route path="*" onEnter={ redirectToRoot } />
    </Route>
  </Router>
), document.getElementById('root'));
