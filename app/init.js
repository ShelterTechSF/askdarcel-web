import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router';

import App from './components/App';
import CategoryPage from './components/Find/FindPage';
import ResourcesTable from './components/Search/ResourcesTable';
import Resource from './components/Resource/Resource';
import EditSections from './components/Edit/EditSections';
import Login from './components/User/Login';
import CreateAccount from './components/User/CreateAccount';
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
      <Route name="editResource" path="/resource/edit" component={ EditSections } />
      <Route name="resource" path="/resource" component={ Resource } />
      <Route path="*" onEnter={ redirectToRoot } />
    </Route>
  </Router>
), document.getElementById('root'));
