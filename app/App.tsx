import React, { useEffect, useState } from "react";

// Todo: Once GA sunsets the UA analytics tracking come July 2023, we can remove the "react-ga"
// package and all references to it:
// https://support.google.com/analytics/answer/12938611#zippy=%2Cin-this-article
import ReactGA_4 from "react-ga4";

import Intercom from "react-intercom";
import { Helmet } from "react-helmet-async";
import { useHistory } from "react-router-dom";

import { GeoCoordinates, getLocation, whiteLabel, AppProvider } from "./utils";
import {
  Banner,
  HamburgerMenu,
  Navigation,
  PopUpMessage, // TODO: Get rid of Popup message and props
  PopupMessageProp,
  UserWay,
} from "./components/ui";

import { Router } from "./Router";

import config from "./config";
import MetaImage from "./assets/img/sfsg-preview.png";

import styles from "./App.module.scss";

const { intercom, showBanner, showSearch, siteUrl, title, userWay } =
  whiteLabel;
const outerContainerId = "outer-container";
const pageWrapId = "page-wrap";

export const App = () => {
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

    if (config.GOOGLE_ANALYTICS_GA4_ID) {
      ReactGA_4.initialize(config.GOOGLE_ANALYTICS_GA4_ID);
    }

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
        <span className={styles.hamburgerContainer}>
          <HamburgerMenu
            isOpen={hamburgerOpen}
            outerContainerId={outerContainerId}
            onStateChange={(s) => setHamburgerOpen(s.isOpen)}
            pageWrapId={pageWrapId}
            toggleHamburgerMenu={() => setHamburgerOpen(!hamburgerOpen)}
          />
        </span>
        <div id={pageWrapId}>
          <Navigation
            showSearch={showSearch}
            toggleHamburgerMenu={() => setHamburgerOpen(!hamburgerOpen)}
          />
          {showBanner && <Banner />}
          <div className="container">
            <Router setPopUpMessage={setPopUpMessage} />
          </div>
          {popUpMessage && <PopUpMessage popUpMessage={popUpMessage} />}
        </div>
      </AppProvider>
    </div>
  );
};
