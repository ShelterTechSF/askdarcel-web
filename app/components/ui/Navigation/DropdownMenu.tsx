import React from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { useMenuToggle } from "hooks/MenuHooks";
import styles from "./DropdownMenu.module.scss";

const DropdownMenu = ({
  title,
  links,
  variant = "navigation",
  id,
}: {
  title: string;
  links: { id: number | string; url: string; text: string }[];
  variant?: "navigation" | "category";
  id: string;
}) => {
  const { activeSubMenu, handleMenuToggle, menuRef } = useMenuToggle();

  const containerClass = classNames(
    styles.navigationMenuContainer,
    variant === "category" && styles.categoryMenuContainer
  );

  return (
    <div className={containerClass} key={id} ref={menuRef}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={activeSubMenu === id ? "true" : "false"}
        onClick={() => handleMenuToggle(id)}
        className={styles.navigationMenuHeader}
      >
        {title}
        <span className={`fas fa-chevron-down ${styles.chevron}`} />
      </button>

      <div
        style={{
          display: activeSubMenu === id ? "block" : "none",
        }}
        className={`${styles.navigationSubMenu}`}
      >
        {links.map((linkItem) => {
          const uuid = crypto.randomUUID();
          return (
            <span key={uuid} className={styles.navigationSubMenuItem}>
              <Link to={linkItem.url} className={styles.menuLink}>
                {linkItem.text}
              </Link>
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default DropdownMenu;
