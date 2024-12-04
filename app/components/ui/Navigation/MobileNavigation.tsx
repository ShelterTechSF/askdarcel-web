import React, { useRef, useState } from "react";
import mobileNavigationStyles from "components/ui/Navigation/MobileNavigation.module.scss";
import { Link } from "react-router-dom";
import {
  ExtractedNavigationMenusFromNavigationResponse,
  NavigationMenu,
  Link as LinkModel,
} from "models/Strapi";
import { Button } from "components/ui/inline/Button/Button";
import useClickOutside from "hooks/MenuHooks";

interface MobileNavigationProps {
  menuData: ExtractedNavigationMenusFromNavigationResponse;
}

export const MobileNavigation = ({ menuData }: MobileNavigationProps) => {
  function menuItemHasLinks(
    menuItem: ExtractedNavigationMenusFromNavigationResponse[number]
  ): menuItem is NavigationMenu {
    return "link" in menuItem;
  }

  const filterMenuRef = useRef<HTMLDivElement>(null);

  const [activeMobileSubMenu, setActiveMobileSubMenu] = useState("");
  const closeMobileMenu = () => {
    setActiveMobileSubMenu("");
    setMobileNavigationIsOpen(false);
  };
  const goBackToTopMenu = () => {
    setActiveMobileSubMenu("");
  };
  const [mobileNavigationIsOpen, setMobileNavigationIsOpen] = useState(false);
  const mobileSubMenuIsActive = !!activeMobileSubMenu;
  const mobileNavIconDisplay = mobileNavigationIsOpen ? "xmark" : "bars";
  const mobileNavTextDisplay = mobileNavigationIsOpen ? "Close" : "Menu";

  useClickOutside(
    filterMenuRef,
    (event: MouseEvent) => {
      // Prevents collison between handling the outside click and clicking on the
      // "Close" button
      if ((event.target as HTMLElement).innerText !== "Close") {
        setMobileNavigationIsOpen(false);
      }
    },
    mobileNavigationIsOpen
  );

  const handleOpenMobileNavigation = () => {
    if (mobileSubMenuIsActive) {
      setActiveMobileSubMenu("");
    } else if (mobileNavigationIsOpen) {
      setMobileNavigationIsOpen(false);
    } else {
      setMobileNavigationIsOpen(true);
    }
  };

  return (
    <>
      <div className={mobileNavigationStyles.menuActivator}>
        <Button
          onClick={handleOpenMobileNavigation}
          iconVariant="after"
          iconName={mobileNavIconDisplay}
          mobileFullWidth={false}
          styleType="transparent"
          variant={mobileNavTextDisplay === "Close" ? "brandDark" : "linkWhite"}
          size="xl"
        >
          {mobileNavTextDisplay}
        </Button>
      </div>
      {mobileNavigationIsOpen && (
        <div
          className={mobileNavigationStyles.mobileNavigationContainer}
          ref={filterMenuRef}
        >
          {menuData?.map((menuDataItem) => {
            if (menuItemHasLinks(menuDataItem)) {
              const uid = menuDataItem.title;
              return (
                <div
                  className={
                    mobileNavigationStyles.mobileNavigationMenuContainer
                  }
                  key={uid}
                >
                  <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={
                      activeMobileSubMenu === uid ? "true" : "false"
                    }
                    onClick={() => setActiveMobileSubMenu(uid)}
                    className={
                      mobileNavigationStyles.mobileNavigationMenuHeader
                    }
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
                      activeMobileSubMenu === uid
                        ? mobileNavigationStyles.mobileNavigationMenuListOpen
                        : ""
                    }`}
                  >
                    <button
                      type="button"
                      onClick={goBackToTopMenu}
                      className={
                        mobileNavigationStyles.mobileNavigationMenuBack
                      }
                    >
                      <span
                        className={`fas fa-chevron-left ${mobileNavigationStyles.chevron}`}
                      />
                      Back
                    </button>
                    {menuDataItem.link.map((linkItem: LinkModel) => {
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
      )}
    </>
  );
};
