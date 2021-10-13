// import { hot } from 'react-hot-loader/root';
import React, { useEffect, useState } from 'react';
import { useHistory, Redirect, Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactGA from 'react-ga';
import Intercom from 'react-intercom';
import { getLocation, COORDS_MID_SAN_FRANCISCO, AppContext, whiteLabel } from './utils';
import { Banner, PopUpMessage, PopupMessageProp, HamburgerMenu, Navigation, UserWay } from './components/ui';
import config from './config';
import MetaImage from './assets/img/sfsg-preview.png';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { CovidPage } from './pages/CovidPage';
import { PrivacyPolicyPage } from './pages/legal/PrivacyPolicy';
import { TermsOfServicePage } from './pages/legal/TermsOfService';
import { ListingDebugPage } from './pages/debug/ListingDemoPage';
import { ResourceGuides, ResourceGuide } from './pages/ResourceGuides';
import { RedirectToOrganizations, RedirectToOrganizationsEdit } from './pages/LegacyRedirects'
import OrganizationEditPage from './pages/OrganizationEditPage';
import { OrganizationListingPage } from './pages/OrganizationListingPage';
import { SearchResultsPage } from './pages/SearchPage';
import { ServiceListingPage } from './pages/ServiceListingPage';
import ServiceDiscoveryForm from './pages/ServiceDiscoveryForm';
import ServiceDiscoveryResults from './pages/ServiceDiscoveryResults';

const {
  intercom,
  showBanner,
  showSearch,
  siteUrl,
  title,
  userWay,
} = whiteLabel;
const outerContainerId = 'outer-container';
const pageWrapId = 'page-wrap';

export const App = () => {
  const history = useHistory()
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState<PopupMessageProp>({ message: '', visible: false, type: 'success' });
  const [userLocation, setUserLocation] = useState<any>(null);

  useEffect(() => {
    getLocation()
      .then(loc => setUserLocation(loc))
      .catch(err => {
        console.log('Could not obtain location, defaulting to San Francisco.', err); // eslint-disable-line no-console
        setUserLocation(COORDS_MID_SAN_FRANCISCO);
      });

    ReactGA.initialize(config.GOOGLE_ANALYTICS_ID);
    return history.listen((loc) => {
      const page = loc.pathname + loc.search;
      ReactGA.set({ page });
      ReactGA.pageview(loc.pathname);
      window.scrollTo(0, 0);
    })
  }, []);

  return (
    <div id={outerContainerId}>
      <AppContext.Provider value={{ setPopUpMessage, userLocation }}>
        <Helmet>
          <title>{title}</title>
          <meta property="og:url" content={siteUrl} />
          <meta property="og:title" content={title} />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@sheltertechorg" />
          <meta property="og:description" content="Get guided help finding food, housing, health resources and more in San Francisco" />
          <meta property="og:image" content={MetaImage} />
          <meta property="og:type" content="website" />
          <meta property="og:image:type" content="image/png" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
        </Helmet>
        {userWay && <UserWay appID={config.SFFAMILIES_USERWAY_APP_ID} />}
        {intercom && config.INTERCOM_APP_ID && <Intercom appID={config.INTERCOM_APP_ID} />}
        <HamburgerMenu
          isOpen={hamburgerOpen}
          outerContainerId={outerContainerId}
          onStateChange={(s: any) => setHamburgerOpen(s)}
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
              <Route exact path="/" component={HomePage} />
              <Route exact path="/about" component={AboutPage} />
              <Route exact path="/covid" component={CovidPage} />
              <Route exact path="/demo/listing" component={ListingDebugPage} />
              <Route exact path="/organizations/:id" component={OrganizationListingPage} />
              <Route exact path="/organizations/:id/edit" component={OrganizationEditPage} />
              <Route exact path="/organizations/new" component={OrganizationEditPage} />
              <Route exact path="/privacy-policy" component={PrivacyPolicyPage} />
              <Route exact path="/resource-guides" component={ResourceGuides} />
              <Route exact path="/resource-guides/:id" component={ResourceGuide} />
              <Route exact path="/search" component={SearchResultsPage} />
              <Route exact path="/services/:id" component={ServiceListingPage} />
              <Route exact path="/terms-of-service" component={TermsOfServicePage} />
              <Route exact path="/:categorySlug/form" component={ServiceDiscoveryForm} />
              <Route exact path="/:categorySlug/results" component={ServiceDiscoveryResults} />

              {/* Legacy redirects */}
              <Redirect path="/resource/new" to="/organizations/new" />
              <Route exact path="/resource/edit" component={RedirectToOrganizationsEdit} />
              <Route exact path="/resource" component={RedirectToOrganizations} />

              <Redirect to="/" />
            </Switch>
          </div>
          { popUpMessage && <PopUpMessage popUpMessage={popUpMessage} /> }
        </div>
      </AppContext.Provider>
    </div>
  );
};
