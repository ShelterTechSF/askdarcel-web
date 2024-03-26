import React, { useEffect, useState } from "react";

// Todo: Once GA sunsets the UA analytics tracking come July 2023, we can remove the "react-ga"
// package and all references to it:
// https://support.google.com/analytics/answer/12938611#zippy=%2Cin-this-article
import ReactGA from "react-ga";
import ReactGA_4 from "react-ga4";

import Intercom from "react-intercom";
import { Helmet } from "react-helmet-async";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";

import { GeoCoordinates, getLocation, whiteLabel, AppProvider } from "./utils";
import {
  Banner,
  HamburgerMenu,
  Navigation,
  PopUpMessage,
  PopupMessageProp,
  UserWay,
} from "./components/ui";

import config from "./config";
import MetaImage from "./assets/img/sfsg-preview.png";

import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { ListingDebugPage } from "./pages/debug/ListingDemoPage";
import { OrganizationListingPage } from "./pages/OrganizationListingPage";
import { PrivacyPolicyPage } from "./pages/legal/PrivacyPolicy";
import {
  RedirectToOrganizations,
  RedirectToOrganizationsEdit,
} from "./pages/LegacyRedirects";
import { ResourceGuides, ResourceGuide } from "./pages/ResourceGuides";
import { SearchResultsPage } from "./pages/SearchResultsPage/SearchResultsPage";
import { ServiceListingPage } from "./pages/ServiceListingPage";
import { ServicePdfPage } from "./pages/Pdf/ServicePdfPage";
import { IntimatePartnerViolencePdfPage } from "./pages/Pdf/IntimatePartnerViolencePdfPage";
import { TermsOfServicePage } from "./pages/legal/TermsOfService";
import { UcsfHomePage } from "./pages/UcsfHomePage/UcsfHomePage";
import { UcsfDiscoveryForm } from "./pages/UcsfDiscoveryForm/UcsfDiscoveryForm";
import OrganizationEditPage from "./pages/OrganizationEditPage";
import { EditBreakingNewsPage } from "./pages/EditBreakingNewsPage";
import { ServiceDiscoveryForm } from "./pages/ServiceDiscoveryForm";
import { ServiceDiscoveryResults } from "./pages/ServiceDiscoveryResults";
import { LoginPage } from "./pages/Auth/LoginPage";
import { SignUpPage } from "./pages/Auth/SignUpPage";
import { LogoutPage } from "./pages/Auth/LogoutPage";

import styles from "./App.module.scss";

const {
  homePageComponent,
  intercom,
  showBanner,
  showSearch,
  siteUrl,
  title,
  userWay,
} = whiteLabel;
const outerContainerId = "outer-container";
const pageWrapId = "page-wrap";

export const App = () => {
  const homePageDictionary = {
    HomePage,
    UcsfHomePage,
  };

  const history = useHistory();
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState<PopupMessageProp>({
    message: "",
    visible: false,
    type: "success",
  });
  const [userLocation, setUserLocation] = useState<GeoCoordinates | null>(null);

  useEffect(() => {
    getLocation().then((loc) => {
      setUserLocation(loc);
    });

    ReactGA.initialize(config.GOOGLE_ANALYTICS_ID);
    ReactGA_4.initialize(config.GOOGLE_ANALYTICS_GA4_ID);
    return history.listen((loc) => {
      setTimeout(() => {
        /* We call setTimeout here to give our views time to update the document title before
           GA sends its page view event
        */
        const page = loc.pathname + loc.search;
        ReactGA_4.send({
          hitType: "pageview",
          page,
        });

        ReactGA.set({ page });
        ReactGA.pageview(page);
      }, 500);
    });
  }, [history]);

  return (
    <div id={outerContainerId} className={styles.outerContainer}>
      <AppProvider userLocation={userLocation}>
        <Helmet>
          <title>{title}</title>
          <meta property="og:url" content={siteUrl} />
          <meta property="og:title" content={title} />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@sheltertechorg" />
          <meta
            property="og:description"
            content="Get guided help finding food, housing, health resources and more in San Francisco"
          />
          <meta property="og:image" content={MetaImage} />
          <meta property="og:type" content="website" />
          <meta property="og:image:type" content="image/png" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
        </Helmet>
        {userWay && <UserWay appID={config.SFFAMILIES_USERWAY_APP_ID} />}
        {intercom && config.INTERCOM_APP_ID && (
          <Intercom appID={config.INTERCOM_APP_ID} />
        )}
        <HamburgerMenu
          isOpen={hamburgerOpen}
          outerContainerId={outerContainerId}
          onStateChange={(s) => setHamburgerOpen(s.isOpen)}
          pageWrapId={pageWrapId}
          toggleHamburgerMenu={() => setHamburgerOpen(!hamburgerOpen)}
        />
        <div id={pageWrapId}>
          <Navigation
            showSearch={showSearch}
            toggleHamburgerMenu={() => setHamburgerOpen(!hamburgerOpen)}
          />
          {showBanner && <Banner />}
          <div className="container">
            <Switch>
              <Route
                exact
                path="/"
                component={homePageDictionary[homePageComponent]}
              />
              <Route exact path="/about" component={AboutPage} />
              <Route exact path="/demo/listing" component={ListingDebugPage} />
              {/* NB: /organizations/new must be listed before /organizations/:id or else the /new
                step will be interpreted as an ID and will thus break the OrganizationEditPage */}
              <Route
                exact
                path="/organizations/new"
                render={(props) => (
                  <OrganizationEditPage
                    {...props}
                    showPopUpMessage={setPopUpMessage}
                  />
                )}
              />
              <Route
                exact
                path="/organizations/:id"
                component={OrganizationListingPage}
              />
              <Route
                exact
                path="/organizations/:id/edit"
                render={(props) => (
                  <OrganizationEditPage
                    {...props}
                    showPopUpMessage={setPopUpMessage}
                  />
                )}
              />
              <Route
                exact
                path="/privacy-policy"
                component={PrivacyPolicyPage}
              />
              <Route exact path="/resource-guides" component={ResourceGuides} />
              <Route
                exact
                path="/resource-guides/:id"
                component={ResourceGuide}
              />
              <Route exact path="/search" component={SearchResultsPage} />
              <Route
                exact
                path="/services/:id"
                component={ServiceListingPage}
              />
              <Route
                exact
                path="/service-handout/:id"
                component={ServicePdfPage}
              />
              <Route
                exact
                path="/intimate-partner-violence-handout/:id"
                component={IntimatePartnerViolencePdfPage}
              />
              <Route
                exact
                path="/terms-of-service"
                component={TermsOfServicePage}
              />
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
              <Route exact path="/log-in" component={LoginPage} />
              <Route exact path="/sign-up" component={SignUpPage} />
              <Route exact path="/log-out" component={LogoutPage} />

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
              <Route
                exact
                path="/resource"
                component={RedirectToOrganizations}
              />
              <Redirect to="/" />
            </Switch>
          </div>
          {popUpMessage && <PopUpMessage popUpMessage={popUpMessage} />}
        </div>
      </AppProvider>
    </div>
  );
};
