import type { PopupMessageProp } from "components/ui";
import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { whiteLabel, useAppContext } from "utils";
import { ProtectedRoute, PublicRoute } from "components/utils";

import { AuthInterstitial } from "pages/AuthInterstitial";
import { HomePage } from "pages/HomePage";
import { AboutPage } from "pages/AboutPageOur415";
import { ListingDebugPage } from "pages/debug/ListingDemoPage";
import { NavigatorDashboard } from "pages/NavigatorDashboard/NavigatorDashboard";
import { OrganizationListingPage } from "pages/OrganizationListingPage";
import { PrivacyPolicyPage } from "pages/legal/PrivacyPolicy";
import {
  RedirectToOrganizations,
  RedirectToOrganizationsEdit,
} from "pages/LegacyRedirects";
import { ResourceGuides, ResourceGuide } from "pages/ResourceGuides";
import { SearchResultsPage } from "pages/SearchResultsPage/SearchResultsPage";
import { ServiceListingPage } from "pages/ServiceListingPage/ServiceListingPage";
import { ServicePdfPage } from "pages/Pdf/ServicePdfPage";
import { IntimatePartnerViolencePdfPage } from "pages/Pdf/IntimatePartnerViolencePdfPage";
import { TermsOfServicePage } from "pages/legal/TermsOfService";
import { UcsfHomePage } from "pages/UcsfHomePage/UcsfHomePage";
import { UcsfDiscoveryForm } from "pages/UcsfDiscoveryForm/UcsfDiscoveryForm";
import OrganizationEditPage from "pages/OrganizationEditPage";
import { EditBreakingNewsPage } from "pages/EditBreakingNewsPage";
import { ServiceDiscoveryForm } from "pages/ServiceDiscoveryForm";
import { ServiceDiscoveryResults } from "pages/ServiceDiscoveryResults";
import { LoginPage } from "pages/Auth/LoginPage";
import { SignUpPage } from "pages/Auth/SignUpPage";
import { LogoutPage } from "pages/Auth/LogoutPage";
import { SecondaryNavigationLayout } from "components/layouts/SecondaryNavigationLayout";
import { BackNavigation } from "components/layouts/BackNavigation";

const { homePageComponent } = whiteLabel;

const homePageDictionary = {
  HomePage,
  UcsfHomePage,
};

const homePage = homePageDictionary[homePageComponent];

export const Router = ({
  setPopUpMessage,
}: {
  setPopUpMessage: (msg: PopupMessageProp) => void;
}) => {
  const { authState } = useAppContext();

  return (
    <Switch>
      <Route exact path="/" component={homePage} />
      <Route exact path="/about" component={AboutPage} />
      <Route exact path="/auth" component={AuthInterstitial} />
      <Route exact path="/demo/listing" component={ListingDebugPage} />
      {/* NB: /organizations/new must be listed before /organizations/:id or else the /new
                step will be interpreted as an ID and will thus break the OrganizationEditPage */}
      <Route
        exact
        path="/organizations/new"
        render={(props) => (
          <OrganizationEditPage {...props} showPopUpMessage={setPopUpMessage} />
        )}
      />
      <Route
        exact
        path="/organizations/:id"
        component={() => (
          <SecondaryNavigationLayout
            navigationChildren={<BackNavigation>Back</BackNavigation>}
          >
            <OrganizationListingPage />
          </SecondaryNavigationLayout>
        )}
      />
      <Route
        exact
        path="/organizations/:id/edit"
        render={(props) => (
          <OrganizationEditPage {...props} showPopUpMessage={setPopUpMessage} />
        )}
      />
      <Route exact path="/privacy-policy" component={PrivacyPolicyPage} />
      <Route exact path="/resource-guides" component={ResourceGuides} />
      <Route exact path="/resource-guides/:id" component={ResourceGuide} />
      <Route exact path="/search" component={SearchResultsPage} />
      <Route
        exact
        path="/services/:id"
        component={() => (
          <SecondaryNavigationLayout
            navigationChildren={
              <BackNavigation defaultReturnTo="/search">
                Back to Services
              </BackNavigation>
            }
          >
            <ServiceListingPage />
          </SecondaryNavigationLayout>
        )}
      />
      <Route exact path="/service-handout/:id" component={ServicePdfPage} />
      <Route
        exact
        path="/intimate-partner-violence-handout/:id"
        component={IntimatePartnerViolencePdfPage}
      />
      <Route exact path="/terms-of-service" component={TermsOfServicePage} />
      <Route
        exact
        path="/:categorySlug/form"
        component={ServiceDiscoveryForm}
      />
      <Route
        exact
        path="/:categorySlug/results"
        component={ServiceDiscoveryResults}
      />
      <Route
        exact
        path="/breaking-news/edit"
        component={EditBreakingNewsPage}
      />
      <ProtectedRoute
        exact
        isAuthenticated={!!authState}
        path="/navigator-dashboard"
        component={NavigatorDashboard}
      />
      <PublicRoute
        exact
        isAuthenticated={!!authState}
        path="/log-in"
        component={LoginPage}
      />
      <PublicRoute
        exact
        isAuthenticated={!!authState}
        path="/sign-up"
        component={SignUpPage}
      />
      <ProtectedRoute
        exact
        isAuthenticated={!!authState}
        path="/log-out"
        component={LogoutPage}
      />

      {/* UCSF white label paths */}
      <Route
        exact
        path="/find-services/:selectedResourceSlug"
        component={UcsfDiscoveryForm}
      />

      {/* Legacy redirects */}
      <Redirect path="/resource/new" to="/organizations/new" />
      <Route
        exact
        path="/resource/edit"
        component={RedirectToOrganizationsEdit}
      />
      <Route exact path="/resource" component={RedirectToOrganizations} />
      <Redirect to="/" />
    </Switch>
  );
};
