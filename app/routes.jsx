import React from 'react';
import { Route, IndexRoute } from 'react-router';
import './utils/google';

import App from './components/App';
// import configureStore from './store/configureStore';

import HomePage from './pages/HomePage';
import OrganizationEditPage from './pages/OrganizationEditPage';
import { OrganizationListingPage } from './pages/OrganizationListingPage';
import { SearchResultsPage } from './pages/SearchPage';
import { ServiceListingPage } from './pages/ServiceListingPage';

import { AdminPage } from './pages/admin/Admin';
import { ChangeRequestsPage } from './pages/admin/ChangeRequests';
import { PrivacyPolicyPage } from './pages/legal/PrivacyPolicy';
import { TermsOfServicePage } from './pages/legal/TermsOfService';
import { AboutPage } from './pages/about/About';
import { ListingDebugPage } from './pages/debug/ListingDemoPage';

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
  <Route path="/" component={App} onChange={scrollToTop}>
    <IndexRoute component={HomePage} />
    <Route name="admin" path="/admin" component={AdminPage} />
    <Route name="changeRequests" path="/admin/changes" component={ChangeRequestsPage} />
    <Route name="editResource" path="/resource/edit" component={OrganizationEditPage} />
    <Route name="newResource" path="/resource/new" component={OrganizationEditPage} />
    <Route name="privacyPolicy" path="/privacy-policy" component={PrivacyPolicyPage} />
    <Route name="resource" path="/resource" component={OrganizationListingPage} />
    <Route name="search" path="/search" component={SearchResultsPage} />
    <Route name="ServicePage" path="/services/:service" component={ServiceListingPage} />
    <Route name="termsOfService" path="/terms-of-service" component={TermsOfServicePage} />
    <Route name="AboutPage" path="/about" component={AboutPage} />
    <Route name="listingDemo" path="/demo/listing" component={ListingDebugPage} />
    <Route path="*" onEnter={redirectToRoot} />
  </Route>
);
