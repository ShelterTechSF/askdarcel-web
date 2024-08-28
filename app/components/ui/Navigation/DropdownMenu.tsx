import React from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { useMenuToggle } from "hooks/MenuHooks";
import styles from "./DropdownMenu.module.scss";

const DropdownMenu = ({
  title,
  links,
  uniqueKey,
  variant = "navigation",
}: {
  title: string;
  links: { id: number | string; url: string; text: string }[];
  uniqueKey: string;
  variant?: "navigation" | "category";
}) => {
  const { activeSubMenu, handleMenuToggle, menuRef } = useMenuToggle();

  const containerClass = classNames(
    styles.navigationMenuContainer,
    variant === "category" && styles.categoryMenuContainer
  );

  return (
    <div className={containerClass} key={uniqueKey} ref={menuRef}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={activeSubMenu === uniqueKey ? "true" : "false"}
        onClick={() => handleMenuToggle(uniqueKey)}
        className={styles.navigationMenuHeader}
      >
        {title}
        <span className={`fas fa-chevron-down ${styles.chevron}`} />
      </button>

      <div
        style={{
          display: activeSubMenu === uniqueKey ? "block" : "none",
        }}
        className={`${styles.navigationSubMenu}`}
      >
        {links.map((linkItem) => (
          <span key={linkItem.id} className={styles.navigationSubMenuItem}>
            <Link to={linkItem.url} className={styles.menuLink}>
              {linkItem.text}
            </Link>
          </span>
        ))}
      </div>
    </div>
  );
};

export default DropdownMenu;
