import React from "react";
import { Link } from "react-router-dom";
import Translate from "./Translate";
import styles from "./Navigation.module.scss";

export const Navigation = ({
  toggleHamburgerMenu,
}: {
  toggleHamburgerMenu: () => void;
}) => {
  return (
    <nav className={styles.siteNav}>
      <div className={styles.primaryRow}>
        <div className={styles.navLeft}>
          <SiteLogo />
        </div>
        <SiteLinks />
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

const SiteLogo = () => (
  <Link className={`${styles.navLogo}`} to="/">
    {/* TODO */}
    [SITE LOGO HERE]
  </Link>
);

const SiteLinks = () => {
  return (
    <div className={styles.navRight}>
      <Translate />
    </div>
  );
};

export default Navigation;
