import React, { useState } from "react";
import mobileNavigationStyles from "components/ui/Navigation/MobileNavigation.module.scss";
import { push as SidebarPushPanel } from "react-burger-menu"; // TODO: use slide instead of push and move close button into sidebar
import { Link } from "react-router-dom";
import styles from "components/ui/Navigation/Navigation.module.scss";
import { GoogleTranslate } from "components/ui/GoogleTranslate";
import desktopNavigationStyles from "components/ui/Navigation/DesktopNavigation.module.scss";
import DropdownMenu from "components/ui/Navigation/DropdownMenu";
import { MobileNavigation } from "components/ui/Navigation/MobileNavigation";
import {
  ExtractedNavigationMenusFromNavigationResponse,
  extractLogoFromNavigationResponse,
  extractNavigationMenusFromNavigationResponse,
  StrapiModel,
} from "models/Strapi";
import { useNavigationData } from "hooks/StrapiAPI";
import { Router } from "../../../Router";
import NavigationFocusReset from "./NavigationFocusReset";
import SkipButton from "./SkipButton";
import { OUTER_CONTAINER_ID } from "../../../App";

const BURGER_STYLES = {
  bmBurgerButton: {
    display: "none",
  },
  bmCrossButton: {
    display: "none",
  },
  bmMenu: {
    padding: "0",
    borderLeft: "1px solid #f4f4f4",
    background: "white",
  },
  bmOverlay: {
    display: "none",
  },
};

const PAGE_WRAP_ID = "page-wrap";

export const Navigation = () => {
  const { data: navigationResponse } = useNavigationData();
  const [mobileNavigationIsOpen, setMobileNavigationIsOpen] = useState(false);
  const [activeMobileSubMenu, setActiveMobileSubMenu] = useState("");
  const toggleMobileNav = () => setMobileNavigationIsOpen((prev) => !prev);

  const logoData = extractLogoFromNavigationResponse(navigationResponse);
  const menuData =
    extractNavigationMenusFromNavigationResponse(navigationResponse);
  const mobileSubMenuIsActive = !!activeMobileSubMenu;
  const inSubNavigation = mobileNavigationIsOpen && mobileSubMenuIsActive;

  function menuItemHasLinks(
    menuItem: ExtractedNavigationMenusFromNavigationResponse[number]
  ): menuItem is StrapiModel.NavigationMenu {
    return "link" in menuItem;
  }

  const mobileNavIconDisplay = () => {
    if (inSubNavigation) {
      return "fa-arrow-left";
    }
    if (mobileNavigationIsOpen) {
      return "fa-xmark";
    }

    return ` fa-bars`;
  };

  const handleOpenMobileNavigation = () => {
    if (inSubNavigation) {
      setActiveMobileSubMenu("");
    } else if (mobileSubMenuIsActive) {
      setMobileNavigationIsOpen(true);
    } else {
      toggleMobileNav();
    }
  };

  return (
    <>
      <NavigationFocusReset />
      <SkipButton />
      <SidebarPushPanel
        isOpen={mobileNavigationIsOpen}
        outerContainerId={OUTER_CONTAINER_ID}
        pageWrapId={PAGE_WRAP_ID}
        right
        styles={BURGER_STYLES}
        className={mobileNavigationStyles.sidebar}
        width="275px"
      >
        {menuData && (
          <MobileNavigation
            isOpen={mobileNavigationIsOpen}
            setSubMenu={setActiveMobileSubMenu}
            activeSubMenu={activeMobileSubMenu}
            menuData={menuData}
          />
        )}
      </SidebarPushPanel>
      <div id={PAGE_WRAP_ID}>
        <nav className={styles.siteNav}>
          <div className={styles.primaryRow}>
            <div className={styles.navLeft}>
              <Link className={`${styles.navLogo}`} to="/">
                <img src={logoData?.url} alt={logoData?.alternativeText} />
              </Link>
            </div>

            <div className={`${styles.navRight} no-print`}>
              <div className={styles.desktopNavigationContainer}>
                {menuData?.map((menuDataItem) => {
                  if (menuItemHasLinks(menuDataItem)) {
                    const uniqueKey = menuDataItem.title;
                    const links = menuDataItem.link.map((linkItem) => ({
                      id: linkItem.id,
                      url: linkItem.url,
                      text: linkItem.text,
                    }));

                    return (
                      <DropdownMenu
                        title={menuDataItem.title}
                        links={links}
                        uniqueKey={uniqueKey}
                      />
                    );
                  }

                  const uniqueKey = menuDataItem.url;
                  return (
                    <Link
                      key={uniqueKey}
                      to={menuDataItem.url}
                      className={desktopNavigationStyles.navigationMenuLink}
                    >
                      {menuDataItem.text}
                    </Link>
                  );
                })}
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