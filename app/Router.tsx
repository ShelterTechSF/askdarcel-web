import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { HomePage } from "pages/HomePage";
import { AboutPage } from "pages/AboutPage";
import { FaqPage } from "pages/FaqPage/FaqPage";
import { ListingDebugPage } from "pages/debug/ListingDemoPage";
import { OrganizationListingPage } from "pages/OrganizationListingPage";
import { PrivacyPolicyPage } from "pages/legal/PrivacyPolicy";
import { ServiceListingPage } from "pages/ServiceListingPage/ServiceListingPage";
import { TermsOfServicePage } from "pages/legal/TermsOfService";
import { ServiceDiscoveryResults } from "pages/ServiceDiscoveryResults";
import { SecondaryNavigationWrapper } from "components/navigation/SecondaryNavigationWrapper";
import { BackButton } from "components/ui/BackButton";
import { SearchHeaderSection } from "components/search/Header/SearchHeaderSection";
import { SearchResultsPage } from "pages/SearchResultsPage/SearchResultsPage";

export const Router = () => {
  return (
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/about" component={AboutPage} />
      <Route exact path="/faqs" component={FaqPage} />
      <Route exact path="/demo/listing" component={ListingDebugPage} />
      {/* NB: /organizations/new must be listed before /organizations/:id or else the /new
                step will be interpreted as an ID and will thus break the OrganizationEditPage */}
      <Route
        exact
        path="/organizations/:id"
        component={() => (
          <>
            <SecondaryNavigationWrapper>
              <BackButton defaultReturnTo="/search">Back</BackButton>
            </SecondaryNavigationWrapper>
            <OrganizationListingPage />
          </>
        )}
      />

      <Route exact path="/privacy-policy" component={PrivacyPolicyPage} />
      <Route
        exact
        path="/search"
        component={() => (
          <>
            <SecondaryNavigationWrapper>
              <SearchHeaderSection descriptionText="Sign up for programs and access resources." />
            </SecondaryNavigationWrapper>
            <SearchResultsPage />
          </>
        )}
      />
      <Route
        exact
        path="/services/:id"
        component={() => (
          <>
            <SecondaryNavigationWrapper>
              <BackButton defaultReturnTo="/search">
                Back to Services
              </BackButton>
            </SecondaryNavigationWrapper>
            <ServiceListingPage />
          </>
        )}
      />
      <Route exact path="/terms-of-service" component={TermsOfServicePage} />
      <Route
        exact
        path="/:categorySlug/results"
        component={ServiceDiscoveryResults}
      />

      <Redirect to="/" />
    </Switch>
  );
};
