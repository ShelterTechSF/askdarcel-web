import React, { useState } from "react";
import { Link } from "react-router-dom";
import Translate from "components/ui/Translate";
import { useNavigationData } from "../../hooks/StrapiAPI";
import {
  StrapiModel,
  extractLogoFromNavigationResponse,
  extractNavigationMenusFromNavigationResponse,
} from "../../models/Strapi";
import styles from "./Navigation.module.scss";

export const Navigation = ({
  toggleHamburgerMenu,
}: {
  toggleHamburgerMenu: () => void;
}) => {
  const { data: navigationResponse, error, isLoading } = useNavigationData();
  const [dropdown, setDropdown] = useState(false);
  const logoData = extractLogoFromNavigationResponse(navigationResponse);
  const menus =
    extractNavigationMenusFromNavigationResponse(navigationResponse);

  // TODO
  if (error) {
    return <span>ERROR</span>;
  }

  // TODO
  if (isLoading) {
    return <span>is loading...</span>;
  }

  return (
    <nav className={styles.siteNav}>
      <div className={styles.primaryRow}>
        <div className={styles.navLeft}>
          <Link className={`${styles.navLogo}`} to="/">
            <img src={logoData?.url} alt={logoData?.alternativeText} />
          </Link>
        </div>

        <ul className={styles.navRight}>
          {menus?.map((menu) => (
            <div className={styles.menuContainer} key={menu.id.toString()}>
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={dropdown ? "true" : "false"}
                onClick={() => setDropdown((prev) => !prev)}
              >
                {menu.title}
              </button>

              <ul
                className={`${styles.dropdown} ${
                  dropdown ? styles.showDropdown : ""
                }`}
              >
                {menu.link.map((linkItem: StrapiModel.Link) => (
                  <li key={linkItem.id} className="menu-item">
                    <Link to={linkItem.url}>{linkItem.text}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <Translate />
        </ul>
        <div className={styles.mobileNavigation}>
          <button
            type="button"
            aria-label="navigation menu"
            className={styles.hamburgerButton}
            onClick={toggleHamburgerMenu}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
