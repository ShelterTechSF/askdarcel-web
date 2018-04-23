import React from 'react';
import { Route, IndexRoute } from 'react-router';
import './utils/google';

import App from './App';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import OrgEditPage from './pages/OrgEditPage';
import OrgPage from './pages/OrgPage';
import OrgSearchPage from './pages/OrgSearchPage';
import Search from './pages/Search';
import ServicePage from './pages/ServicePage';

import RequireAuth from './components/auth/RequireAuth';
import AdminChangeRequests from './pages/AdminChangeRequestsPage';
import AdminDashboard from './pages/AdminDashboardPage';

function redirectToRoot(nextState, replace) {
  replace({
    pathname: '/',
  });
}

// Adapted from
// https://github.com/ReactTraining/react-router/issues/2019#issuecomment-256591800
// Note: When we upgrade to react-router 4.x, we should use
// https://github.com/ReactTraining/react-router/blob/v4.1.1/packages/react-router-dom/docs/guides/scroll-restoration.md
function scrollToTop(prevState, nextState) {
  if (nextState.location.action !== 'POP') {
    window.scrollTo(0, 0);
  }
}

export default (
  <Route path="/" component={App} onChange={scrollToTop} >
    <IndexRoute name="HomePage" component={HomePage} />
    <Route path="/login" name="login" component={LoginPage} />
    <Route path="/resources" name="resources" component={OrgSearchPage} />
    <Route path="/resources/new" name="newResource" component={OrgEditPage} />
    <Route path="/resources/r/:resource" name="resource" component={OrgPage} />
    <Route path="/resources/r/:resource/edit" name="editResource" component={OrgEditPage} />
    <Route path="/search" name="search" component={Search} />
    <Route path="/services/:service" name="ServicePage" component={ServicePage} />
    <Route path="/admin" name="Admin" component={RequireAuth(AdminDashboard)} />
    <Route
      path="/admin/changes"
      name="AdminChangeRequests"
      component={RequireAuth(AdminChangeRequests)}
    />
    <Route path="*" onEnter={redirectToRoot} />
  </Route>
);
