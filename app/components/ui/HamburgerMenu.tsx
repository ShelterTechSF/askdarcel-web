import React, { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { push as Menu, State } from "react-burger-menu";
import whiteLabel from "../../utils/whitelabel";
import styles from "./HamburgerMenu.module.scss";

const { showReportCrisis } = whiteLabel;

const burgerStyles = {
  bmBurgerButton: {
    display: "none",
  },
  bmCrossButton: {
    display: "none",
  },
  bmMenu: {
    padding: "0",
    borderLeft: "1px solid #f4f4f4",
  },
  bmOverlay: {
    display: "none",
  },
};

const links: {
  to: string;
  text: string;
  exact?: boolean;
  external?: boolean;
  linkStyles?: string;
}[] = [
  {
    to: "/",
    text: "Home",
    exact: true,
  },
  { to: "/about", text: "About" },
  { to: "https://help.sfserviceguide.org", text: "FAQ" },
  {
    to: "https://help.sfserviceguide.org/en/collections/1719243-contact-us",
    text: "Contact Us",
  },
  {
    to: "https://www.facebook.com/ShelterTechOrg/",
    text: "Facebook",
    external: true,
  },
  { to: "https://twitter.com/sheltertechorg", text: "Twitter", external: true },
  { to: "/terms-of-service", text: "Terms of Service" },
  { to: "/privacy-policy", text: "Privacy Policy" },
];

if (showReportCrisis) {
  links.push({
    to: "https://sf.gov/information/reporting-concerns-about-street-crises-and-conditions",
    text: "Report Street Crisis",
    external: true,
    linkStyles: `${styles.menuItem} ${styles.emphasized}`,
  });
}

export const HamburgerMenu = ({
  isOpen,
  onStateChange,
  outerContainerId,
  pageWrapId,
  toggleHamburgerMenu,
}: {
  isOpen: boolean;
  onStateChange: (s: State) => void;
  outerContainerId: string;
  pageWrapId: string;
  toggleHamburgerMenu: () => void;
}) => (
  <Menu
    isOpen={isOpen}
    onStateChange={onStateChange}
    outerContainerId={outerContainerId}
    pageWrapId={pageWrapId}
    right
    styles={burgerStyles}
    width="275px"
  >
    {links.map(
      ({
        to,
        text,
        exact = false,
        external = false,
        linkStyles = styles.menuItem,
      }) => (
        <MenuItem
          key={to}
          to={to}
          onClick={toggleHamburgerMenu}
          exact={exact}
          linkStyles={linkStyles}
          external={external}
        >
          {text}
        </MenuItem>
      )
    )}
  </Menu>
);

const MenuItem = ({
  children,
  onClick,
  to,
  exact,
  linkStyles,
  external,
}: {
  children: ReactNode;
  onClick: () => void;
  to: string;
  exact: boolean;
  linkStyles: string;
  external: boolean;
}) =>
  to.startsWith("http") || to.startsWith("mailto:") ? (
    <a
      className={linkStyles}
      href={to}
      rel="noopener noreferrer"
      target={external ? "_blank" : "_self"}
    >
      {children}
    </a>
  ) : (
    <NavLink
      className={linkStyles}
      activeClassName={styles.active}
      to={to}
      onClick={onClick}
      exact={exact}
    >
      {children}
    </NavLink>
  );
