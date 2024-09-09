import React from "react";
import mobileNavigationStyles from "components/ui/Navigation/MobileNavigation.module.scss";
import { Link } from "react-router-dom";
import {
  ExtractedNavigationMenusFromNavigationResponse,
  StrapiModel,
} from "models/Strapi";
import { GoogleTranslate } from "../GoogleTranslate";

interface MobileNavigationProps {
  isOpen: boolean;
  activeSubMenu: string;
  setSubMenu: (value: string) => void;
  menuData: ExtractedNavigationMenusFromNavigationResponse;
}

export const MobileNavigation = ({
  isOpen = false,
  activeSubMenu,
  setSubMenu,
  menuData,
}: MobileNavigationProps) => {
  function menuItemHasLinks(
    menuItem: ExtractedNavigationMenusFromNavigationResponse[number]
  ): menuItem is StrapiModel.NavigationMenu {
    return "link" in menuItem;
  }
  const closeMobileMenu = () => {
    setSubMenu("");
  };

  return (
    <>
      <div className={mobileNavigationStyles.mobileNavigationContainer}>
        {menuData?.map((menuDataItem) => {
          if (menuItemHasLinks(menuDataItem)) {
            const uid = menuDataItem.title;
            return (
              <div
                className={mobileNavigationStyles.mobileNavigationMenuContainer}
                key={uid}
              >
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={activeSubMenu === uid ? "true" : "false"}
                  onClick={() => setSubMenu(uid)}
                  className={mobileNavigationStyles.mobileNavigationMenuHeader}
                >
                  {menuDataItem.title}
                  <span
                    className={`fas fa-chevron-right ${mobileNavigationStyles.chevron}`}
                  />
                </button>
                <ul
                  className={`${
                    mobileNavigationStyles.mobileNavigationMenuList
                  } ${
                    activeSubMenu === uid
                      ? mobileNavigationStyles.mobileNavigationMenuListOpen
                      : ""
                  }`}
                >
                  {menuDataItem.link.map((linkItem: StrapiModel.Link) => {
                    const uuid = crypto.randomUUID();
                    return (
                      <li
                        key={uuid}
                        className={
                          mobileNavigationStyles.mobileNavigationMenuListItem
                        }
                      >
                        <Link
                          to={linkItem.url}
                          className={
                            mobileNavigationStyles.mobileNavigationMenuLink
                          }
                          onClick={closeMobileMenu}
                        >
                          {linkItem.text}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          }

          return (
            <li
              key={crypto.randomUUID()}
              className={mobileNavigationStyles.mobileNavigationMenuListItem}
            >
              <Link
                to={menuDataItem.url}
                className={mobileNavigationStyles.mobileNavigationMenuLink}
                onClick={closeMobileMenu}
              >
                {menuDataItem.text}
              </Link>
            </li>
          );
        })}
      </div>
      {isOpen && (
        <div className={mobileNavigationStyles.mobileNavigationMenuTranslate}>
          <GoogleTranslate />
        </div>
      )}
    </>
  );
};
