import React from 'react';
import { Route, Link, browserHistory, IndexRoute, withRouter } from 'react-router';

import configureStore from './store/configureStore';
import App from './components/App';
import CategoryPage from './components/Find/FindPage';
import ResourcesTable from './components/Search/ResourcesTable';
import Resource from './components/Resource/Resource';
import EditSections from './components/Edit/EditSections';
import ServicePage from './pages/Service';
import Login from './components/User/Login';
// import Google from './utils/google';
// import CreateAccount from './components/User/CreateAccount';
// import TestAuth from './components/User/TestAuth';
import Admin from './components/Admin/Admin';
import ChangeRequests from './components/Admin/ChangeRequests';
import Search from './pages/Search';
import PrivacyPolicyPage from './pages/legal/PrivacyPolicy';
import TermsOfServicePage from './pages/legal/TermsOfService';

import { RequireAuth } from './components/Auth/RequireAuth';

function redirectToRoot (nextState, replace) {
  replace({
    pathname: '/',
  });
};

// Adapted from
// https://github.com/ReactTraining/react-router/issues/2019#issuecomment-256591800
// Note: When we upgrade to react-router 4.x, we should use
// https://github.com/ReactTraining/react-router/blob/v4.1.1/packages/react-router-dom/docs/guides/scroll-restoration.md
function scrollToTop(prevState, nextState) {
  if (nextState.location.action !== "POP") {
    window.scrollTo(0, 0);
  }
}

export default (
  <Route path="/" component={ App } onChange={ scrollToTop } >
    <IndexRoute component={ CategoryPage } />
    <Route name="resources" path="/resources" component={ ResourcesTable } />
    <Route name="editResource" path="/resource/edit" component={ EditSections } />
    <Route name="newResource" path="/resource/new" component={ EditSections } />
    <Route name="search" path="/search" component={ Search } />
    <Route name="resource" path="/resource" component={ Resource }  />
    <Route name="ServicePage" path="/services/:service" component={ ServicePage } />
    <Route name="admin" path="/admin" component={ RequireAuth(Admin) } />
    <Route name="changeRequests" path="/admin/changes" component={ RequireAuth(ChangeRequests) } />
    <Route name="login" path="/login" component={ Login } />
    <Route name="privacyPolicy" path="/privacy-policy" component={ PrivacyPolicyPage } />
    <Route name="termsOfService" path="/terms-of-service" component={ TermsOfServicePage } />
    <Route path="*" onEnter={ redirectToRoot } />
  </Route>
);
