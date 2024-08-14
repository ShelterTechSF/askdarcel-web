import React from "react";
import { Link } from "react-router-dom";
import styles from "components/ui/Navigation/MobileNavigation.module.scss";

import {
  StrapiModel,
  ExtractedNavigationMenusFromNavigationResponse,
} from "../../../models/Strapi";

function menuItemHasLinks(
  menuItem: ExtractedNavigationMenusFromNavigationResponse[number]
): menuItem is StrapiModel.NavigationMenu {
  return "link" in menuItem;
}

const MobileMenuItems = ({
  menuItem,
  activeMobileSubMenu,
  setActiveMobileSubMenu,
  closeMobileMenu,
}: {
  menuItem: ExtractedNavigationMenusFromNavigationResponse[number];
  activeMobileSubMenu: string;
  setActiveMobileSubMenu: (uniqueKey: string) => void;
  closeMobileMenu: () => void;
}) => {
  if (menuItemHasLinks(menuItem)) {
    const uniqueKey = menuItem.title;
    return (
      <div className={styles.mobileNavigationMenuContainer} key={uniqueKey}>
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={activeMobileSubMenu === uniqueKey ? "true" : "false"}
          onClick={() => setActiveMobileSubMenu(uniqueKey)}
          className={styles.mobileNavigationMenuHeader}
        >
          {menuItem.title}
          <span className={`fas fa-chevron-right ${styles.chevron}`} />
        </button>
        <ul
          className={`${styles.mobileNavigationMenuList} ${
            activeMobileSubMenu === uniqueKey
              ? styles.mobileNavigationMenuListOpen
              : ""
          }`}
        >
          {menuItem.link.map((linkItem: StrapiModel.Link) => (
            <li
              key={linkItem.id}
              className={styles.mobileNavigationMenuListItem}
            >
              <Link
                to={linkItem.url}
                className={styles.mobileNavigationMenuLink}
                onClick={closeMobileMenu}
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
    <li key={uniqueKey} className={styles.mobileNavigationMenuListItem}>
      <Link
        to={menuItem.url}
        className={styles.mobileNavigationMenuLink}
        onClick={closeMobileMenu}
      >
        {menuItem.text}
      </Link>
    </li>
  );
};

export default MobileMenuItems;
