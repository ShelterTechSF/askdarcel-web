import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import qs from 'qs';
import './utils/google';

// import configureStore from './store/configureStore';

import HomePage from './pages/HomePage';
import OrganizationEditPage from './pages/OrganizationEditPage';
import { OrganizationListingPage } from './pages/OrganizationListingPage';
import { SearchResultsPage } from './pages/SearchPage';
import { ServiceListingPage } from './pages/ServiceListingPage';

import Hygiene from './pages/Hygiene';
import ShelterAccess from './pages/ShelterAccess';
import MedicalServices from './pages/MedicalServices';
import DomesticViolence from './pages/DomesticViolence';
import InternetAccess from './pages/InternetAccess';
import FinancialAssistance from './pages/FinancialAssistance';
import RentalAssistance from './pages/RentalAssistance';
import LGBTQResources from './pages/LGBTQResources';
import { PrivacyPolicyPage } from './pages/legal/PrivacyPolicy';
import { TermsOfServicePage } from './pages/legal/TermsOfService';
import About from './pages/About';
import Covid from './pages/Covid';
import FoodMap from './pages/FoodMap';
import FoodList from './pages/FoodList';
import { ListingDebugPage } from './pages/debug/ListingDemoPage';

const RedirectToOrganizations = ({ location: { search } }) => {
  const { id } = qs.parse(search.slice(1));
  return <Redirect to={`/organizations/${id}`} />;
};

const RedirectToOrganizationsEdit = ({ location: { search } }) => {
  const { resourceid: id } = qs.parse(search.slice(1));
  return <Redirect to={`/organizations/${id}/edit`} />;
};

export default () => (
  <Switch>
    <Route exact path="/" component={HomePage} />
    <Route path="/about" component={About} />
    <Route path="/foodlist" component={FoodList} />
    <Route path="/foodmap" component={FoodMap} />
    <Route path="/covid" component={Covid} />
    <Route path="/hygiene" component={Hygiene} />
    <Route path="/shelteraccess" component={ShelterAccess} />
    <Route path="/medicalservices" component={MedicalServices} />
    <Route path="/domesticviolence" component={DomesticViolence} />
    <Route path="/internet" component={InternetAccess} />
    <Route path="/financialassistance" component={FinancialAssistance} />
    <Route path="/rentalassistance" component={RentalAssistance} />
    <Route path="/lgbtq" component={LGBTQResources} />
    <Route path="/demo/listing" component={ListingDebugPage} />
    <Route path="/organizations/new" component={OrganizationEditPage} />
    <Route path="/organizations/:id/edit" component={OrganizationEditPage} />
    <Route path="/organizations/:id" component={OrganizationListingPage} />
    <Route path="/privacy-policy" component={PrivacyPolicyPage} />
    <Route path="/search" component={SearchResultsPage} />
    <Route path="/services/:service" component={ServiceListingPage} />
    <Route path="/terms-of-service" component={TermsOfServicePage} />

    {/* Legacy redirects */}
    <Redirect path="/resource/new" to="/organizations/new" />
    <Route path="/resource/edit" component={RedirectToOrganizationsEdit} />
    <Route path="/resource" component={RedirectToOrganizations} />

    <Redirect to="/" />
  </Switch>
);