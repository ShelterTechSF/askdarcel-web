import React from 'react';
import {
  Redirect, Route, RouteComponentProps, Switch,
} from 'react-router-dom';
import qs from 'qs';
import './utils/google';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { CovidPage } from './pages/CovidPage';
import { PrivacyPolicyPage } from './pages/legal/PrivacyPolicy';
import { TermsOfServicePage } from './pages/legal/TermsOfService';
import { ListingDebugPage } from './pages/debug/ListingDemoPage';
import { ResourceGuides, ResourceGuide } from './pages/ResourceGuides';

import OrganizationEditPage from './pages/OrganizationEditPage';
import { OrganizationListingPage } from './pages/OrganizationListingPage';
import { SearchResultsPage } from './pages/SearchPage';
import { ServiceListingPage } from './pages/ServiceListingPage';
import ServiceDiscoveryForm from './pages/ServiceDiscoveryForm';
import ServiceDiscoveryResults from './pages/ServiceDiscoveryResults';

const RedirectToOrganizations = ({ location: { search } }: RouteComponentProps) => {
  const { id } = qs.parse(search.slice(1));
  return <Redirect to={`/organizations/${id}`} />;
};

const RedirectToOrganizationsEdit = ({ location: { search } }: RouteComponentProps) => {
  const { resourceid: id } = qs.parse(search.slice(1));
  return <Redirect to={`/organizations/${id}/edit`} />;
};

export default () => (
  <Switch>
    <Route exact path="/" component={HomePage} />
    <Route path="/about" component={AboutPage} />
    <Route path="/covid" component={CovidPage} />
    <Route path="/resource-guides/:id" component={ResourceGuide} />
    <Route path="/resource-guides" component={ResourceGuides} />
    <Route path="/demo/listing" component={ListingDebugPage} />
    <Route path="/organizations/new" component={OrganizationEditPage} />
    <Route path="/organizations/:id/edit" component={OrganizationEditPage} />
    <Route path="/organizations/:id" component={OrganizationListingPage} />
    <Route path="/privacy-policy" component={PrivacyPolicyPage} />
    <Route path="/search" component={SearchResultsPage} />
    <Route path="/services/:id" component={ServiceListingPage} />
    <Route path="/terms-of-service" component={TermsOfServicePage} />
    <Route path="/:categorySlug/form" component={ServiceDiscoveryForm} />
    <Route path="/:categorySlug/results" component={ServiceDiscoveryResults} />

    {/* Legacy redirects */}
    <Redirect path="/resource/new" to="/organizations/new" />
    <Route path="/resource/edit" component={RedirectToOrganizationsEdit} />
    <Route path="/resource" component={RedirectToOrganizations} />

    <Redirect to="/" />
  </Switch>
);
