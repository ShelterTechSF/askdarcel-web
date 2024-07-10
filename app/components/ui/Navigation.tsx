import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "components/ui/Navigation.module.scss";
import mobileNavigationStyles from "components/ui/MobileNavigation.module.scss";
import desktopNavigationStyles from "components/ui/DesktopNavigation.module.scss";
import { push as SidebarPushPanel } from "react-burger-menu";
import { GoogleTranslate } from "components/ui/GoogleTranslate";
import {
  StrapiModel,
  extractLogoFromNavigationResponse,
  extractNavigationMenusFromNavigationResponse,
  ExtractedNavigationMenusFromNavigationResponse,
} from "../../models/Strapi";
import { PopUpMessage, PopupMessageProp } from "./PopUpMessage";
import { Router } from "../../Router";
import { useNavigationData } from "../../hooks/StrapiAPI";
import { OUTER_CONTAINER_ID } from "../../App";

const PAGE_WRAP_ID = "page-wrap";
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

export const Navigation = () => {
  const { data: navigationResponse, error, isLoading } = useNavigationData();
  const [mobileNavigationSidebarIsOpen, setMobileNavigationSidebarIsOpen] =
    useState(false);
  const [whichActiveMobileSubMenu, setActiveMobileSubMenu] = useState("");
  const toggleMobileNav = () =>
    setMobileNavigationSidebarIsOpen((prev) => !prev);
  const [whichActiveDesktopSubMenu, setsetActiveDesktopSubMenu] = useState("");
  const [popUpMessage, setPopUpMessage] = useState<PopupMessageProp>({
    message: "",
    visible: false,
    type: "success",
  });

  const logoData = extractLogoFromNavigationResponse(navigationResponse);
  const menuData =
    extractNavigationMenusFromNavigationResponse(navigationResponse);
  const mobileSubMenuIsActive = !!whichActiveMobileSubMenu;
  const desktopSubMenuIsActive = !!whichActiveDesktopSubMenu;

  const pushPanelIconDisplay = () => {
    if (mobileNavigationSidebarIsOpen && mobileSubMenuIsActive) {
      return "fa-arrow-left";
    }
    if (mobileNavigationSidebarIsOpen) {
      return "fa-xmark";
    }

    return ` fa-bars`;
  };

  const handleActivatePushPanelClick = () => {
    if (mobileSubMenuIsActive) {
      setActiveMobileSubMenu("");
    } else {
      toggleMobileNav();
    }
  };

  const togglesetActiveDesktopSubMenu = (next: string) => {
    if (desktopSubMenuIsActive && whichActiveDesktopSubMenu === next) {
      setsetActiveDesktopSubMenu("");
    } else {
      setsetActiveDesktopSubMenu(next);
    }
  };

  // TODO: What do we want here?
  if (error || menuData === null) {
    return <span>ERROR</span>;
  }

  // TODO: What do we want here?
  if (isLoading) {
    return <span>is loading...</span>;
  }

  return (
    <>
      <SidebarPushPanel
        isOpen={mobileNavigationSidebarIsOpen}
        outerContainerId={OUTER_CONTAINER_ID}
        pageWrapId={PAGE_WRAP_ID}
        right
        styles={BURGER_STYLES}
        width="275px"
      >
        <div>
          {menuData.map((menuDataItem) => (
            <MobileNavigationMenuDataItemRenderer
              menuItem={menuDataItem}
              whichActiveMobileSubMenu={whichActiveMobileSubMenu}
              setActiveMobileSubMenu={setActiveMobileSubMenu}
              key={menuDataItem.id}
            />
          ))}
          {mobileNavigationSidebarIsOpen && (
            <div className={styles.navigationMenuTranslate}>
              <GoogleTranslate />
            </div>
          )}
        </div>
      </SidebarPushPanel>
      <div id={PAGE_WRAP_ID}>
        <nav className={styles.siteNav}>
          <div className={styles.primaryRow}>
            <div className={styles.navLeft}>
              <Link className={`${styles.navLogo}`} to="/">
                <img src={logoData?.url} alt={logoData?.alternativeText} />
              </Link>
            </div>

            <ul className={`${styles.navRight}`}>
              <div
                className={desktopNavigationStyles.desktopNavigationContainer}
              >
                {menuData.map((menuDataItem) => (
                  <DesktoptopLevelNavigationMenuItemRenderer
                    menuItem={menuDataItem}
                    whichActiveDesktopSubMenu={whichActiveDesktopSubMenu}
                    togglesetActiveDesktopSubMenu={
                      togglesetActiveDesktopSubMenu
                    }
                    key={menuDataItem.id}
                  />
                ))}
              </div>
              <div className={styles.navigationMenuTranslate}>
                <GoogleTranslate />
              </div>
            </ul>
            <button
              type="button"
              aria-label="navigation menu"
              className={`fas ${pushPanelIconDisplay()} ${
                styles.activatePushPanelButton
              }`}
              onClick={handleActivatePushPanelClick}
            />
          </div>
        </nav>
        <div className="container">
          <Router setPopUpMessage={setPopUpMessage} />
        </div>
        {popUpMessage && <PopUpMessage popUpMessage={popUpMessage} />}
      </div>
    </>
  );
};

function menuItemHasLinks(
  menuItem: ExtractedNavigationMenusFromNavigationResponse[number]
): menuItem is StrapiModel.NavigationMenu {
  return "link" in menuItem;
}

const DesktoptopLevelNavigationMenuItemRenderer = ({
  menuItem,
  whichActiveDesktopSubMenu,
  togglesetActiveDesktopSubMenu,
}: {
  menuItem: ExtractedNavigationMenusFromNavigationResponse[number];
  whichActiveDesktopSubMenu: string;
  togglesetActiveDesktopSubMenu: (uniqueKey: string) => void;
}) => {
  if (menuItemHasLinks(menuItem)) {
    const uniqueKey = menuItem.title;
    return (
      <div
        className={desktopNavigationStyles.navigationMenuContainer}
        key={uniqueKey}
      >
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={
            whichActiveDesktopSubMenu === uniqueKey ? "true" : "false"
          }
          onClick={() => togglesetActiveDesktopSubMenu(uniqueKey)}
          className={desktopNavigationStyles.navigationMenuHeader}
        >
          {menuItem.title}
          <span
            className={`fas fa-chevron-down ${desktopNavigationStyles.chevron}`}
          />
        </button>

        <ul
          style={{
            display: whichActiveDesktopSubMenu === uniqueKey ? "block" : "none",
          }}
          className={`${desktopNavigationStyles.navigationMenuList}`}
        >
          {menuItem.link.map((linkItem: StrapiModel.Link) => (
            <li
              key={linkItem.id}
              className={desktopNavigationStyles.navigationMenuListItem}
            >
              <Link
                to={linkItem.url}
                className={desktopNavigationStyles.navigationMenuLink}
              >
                {linkItem.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const uniqueKey = menuItem.url;
  return (
    <li key={uniqueKey}>
      <Link
        to={menuItem.url}
        className={desktopNavigationStyles.navigationMenuLink}
      >
        {menuItem.text}
      </Link>
    </li>
  );
};

const MobileNavigationMenuDataItemRenderer = ({
  menuItem,
  whichActiveMobileSubMenu,
  setActiveMobileSubMenu,
}: {
  menuItem: ExtractedNavigationMenusFromNavigationResponse[number];
  whichActiveMobileSubMenu: string;
  setActiveMobileSubMenu: (uniqueKey: string) => void;
}) => {
  if (menuItemHasLinks(menuItem)) {
    const uniqueKey = menuItem.title;
    return (
      <div
        className={mobileNavigationStyles.mobileNavigationMenuContainer}
        key={uniqueKey}
      >
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={
            whichActiveMobileSubMenu === uniqueKey ? "true" : "false"
          }
          onClick={() => setActiveMobileSubMenu(uniqueKey)}
          className={`${mobileNavigationStyles.mobileNavigationMenuHeader}`}
        >
          {menuItem.title}
          <span
            className={`fas fa-chevron-right ${mobileNavigationStyles.chevron}`}
          />
        </button>
        <ul
          className={`${mobileNavigationStyles.mobileNavigationMenuList} ${
            whichActiveMobileSubMenu === uniqueKey
              ? mobileNavigationStyles.mobileNavigationMenuListOpen
              : ""
          }`}
        >
          {menuItem.link.map((linkItem: StrapiModel.Link) => (
            <li
              key={linkItem.id}
              className={mobileNavigationStyles.mobileNavigationMenuListItem}
            >
              <Link
                to={linkItem.url}
                className={mobileNavigationStyles.mobileNavigationMenuLink}
              >
                {linkItem.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const uniqueKey = menuItem.url;
  return (
    <li
      key={uniqueKey}
      className={mobileNavigationStyles.mobileNavigationMenuListItem}
    >
      <Link
        to={menuItem.url}
        className={mobileNavigationStyles.mobileNavigationMenuLink}
      >
        {menuItem.text}
      </Link>
    </li>
  );
};

export default Navigation;
