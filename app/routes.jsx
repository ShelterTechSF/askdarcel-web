import React from 'react';
import { Redirect, Route, IndexRoute } from 'react-router-dom';
import './utils/google';

import App from './components/App';
// import configureStore from './store/configureStore';

import HomePage from './pages/HomePage';
import OrganizationEditPage from './pages/OrganizationEditPage';
import { OrganizationListingPage } from './pages/OrganizationListingPage';
import { SearchResultsPage } from './pages/SearchPage';
import { ServiceListingPage } from './pages/ServiceListingPage';

import { PrivacyPolicyPage } from './pages/legal/PrivacyPolicy';
import { TermsOfServicePage } from './pages/legal/TermsOfService';
import About from './pages/About';
import { ListingDebugPage } from './pages/debug/ListingDemoPage';

function redirectToRoot(nextState, replace) {
  replace({
    pathname: '/',
  });
}

const redirectToOrganizations = (nextState, replace) => {
  const { location: { query: { id } } } = nextState;
  replace(`/organizations/${id}`);
};

const redirectToOrganizationsEdit = (nextState, replace) => {
  const { location: { query: { resourceid: id } } } = nextState;
  replace(`/organizations/${id}/edit`);
};

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
    <Route path="/about" component={About} />
    <Route path="/demo/listing" component={ListingDebugPage} />
    <Route path="/organizations/new" component={OrganizationEditPage} />
    <Route path="/organizations/:id" component={OrganizationListingPage} />
    <Route path="/organizations/:id/edit" component={OrganizationEditPage} />
    <Route path="/privacy-policy" component={PrivacyPolicyPage} />
    <Route path="/search" component={SearchResultsPage} />
    <Route path="/services/:service" component={ServiceListingPage} />
    <Route path="/terms-of-service" component={TermsOfServicePage} />

    {/* Legacy redirects */}
    <Route path="/resource" onEnter={redirectToOrganizations} />
    <Route path="/resource/edit" onEnter={redirectToOrganizationsEdit} />
    <Redirect path="/resource/new" to="/organizations/new" />

    <Route path="*" onEnter={redirectToRoot} />
  </Route>
);
