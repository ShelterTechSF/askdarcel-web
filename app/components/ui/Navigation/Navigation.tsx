import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "components/ui/Navigation/Navigation.module.scss";
import desktopNavigationStyles from "components/ui/Navigation/DesktopNavigation.module.scss";
import { GoogleTranslate } from "components/ui/GoogleTranslate";
import {
  extractLogoFromNavigationResponse,
  extractNavigationMenusFromNavigationResponse,
} from "../../../models/Strapi";
import { Router } from "../../../Router";
import { useNavigationData } from "../../../hooks/StrapiAPI";
import DesktopMenuItems from "./DesktopMenuItems";
import MobileNavigation from "./MobileNavigation";
import NavigationFocusReset from "./NavigationFocusReset";
import SkipButton from "./SkipButton";

const PAGE_WRAP_ID = "page-wrap";

export const Navigation = () => {
  const { data: navigationResponse } = useNavigationData();
  const [mobileNavigationIsOpen, setMobileNavigationIsOpen] = useState(false);
  const [activeMobileSubMenu, setActiveMobileSubMenu] = useState(null);
  const toggleMobileNav = () => setMobileNavigationIsOpen((prev) => !prev);

  const logoData = extractLogoFromNavigationResponse(navigationResponse);
  const menuData =
    extractNavigationMenusFromNavigationResponse(navigationResponse);
  const mobileSubMenuIsActive = !!activeMobileSubMenu;

  const mobileNavIconDisplay = () => {
    if (mobileNavigationIsOpen && mobileSubMenuIsActive) {
      return "fa-arrow-left";
    }
    if (mobileNavigationIsOpen) {
      return "fa-xmark";
    }

    return ` fa-bars`;
  };

  const handleOpenMobileNavigation = () => {
    if (mobileSubMenuIsActive) {
      setActiveMobileSubMenu(null);
    } else {
      toggleMobileNav();
    }
  };

  return (
    <>
      <NavigationFocusReset />
      <SkipButton />
      <MobileNavigation
        isOpen={mobileNavigationIsOpen}
        setIsOpen={setMobileNavigationIsOpen}
        menuData={menuData}
      />
      <div id={PAGE_WRAP_ID}>
        <nav className={styles.siteNav}>
          <div className={styles.primaryRow}>
            <div className={styles.navLeft}>
              <Link className={`${styles.navLogo}`} to="/">
                <img src={logoData?.url} alt={logoData?.alternativeText} />
              </Link>
            </div>

            <div className={`${styles.navRight}`}>
              <div
                className={desktopNavigationStyles.desktopNavigationContainer}
              >
                {menuData?.map((menuDataItem) => (
                  <DesktopMenuItems
                    menuItem={menuDataItem}
                    key={menuDataItem.id}
                  />
                ))}
              </div>
              <div className={styles.navigationMenuTranslate}>
                <GoogleTranslate />
              </div>
            </div>
            <button
              type="button"
              aria-label="navigation menu"
              className={`fas ${mobileNavIconDisplay()} ${
                styles.activatePushPanelButton
              }`}
              onClick={handleOpenMobileNavigation}
            />
          </div>
        </nav>
        <main className="container" id="main">
          <Router />
        </main>
      </div>
    </>
  );
};

export default Navigation;
