import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { push as Menu } from 'react-burger-menu';

import styles from './HamburgerMenu.scss';


const burgerStyles = {
  bmBurgerButton: {
    display: 'none',
  },
  bmCrossButton: {
    display: 'none',
  },
  bmMenu: {
    padding: '0',
    borderLeft: '1px solid #f4f4f4',
  },
  bmOverlay: {
    display: 'none',
  },
};

const links = [
  { to: '/', text: 'Home', exact: true },
  { to: '/about', text: 'About' },
  { to: '/covid', text: 'Coronavirus' },
  { to: 'https://help.sfserviceguide.org', text: 'FAQ' },
  { to: 'https://help.sfserviceguide.org/en/collections/1719243-contact-us', text: 'Contact Us' },
  { to: 'https://www.facebook.com/ShelterTechOrg/', text: 'Facebook' },
  { to: 'https://twitter.com/sheltertechorg', text: 'Twitter' },
  { to: '/terms-of-service', text: 'Terms of Service' },
  { to: '/privacy-policy', text: 'Privacy Policy' },
];

const HamburgerMenu = ({
  isOpen,
  onStateChange,
  outerContainerId,
  pageWrapId,
  toggleHamburgerMenu,
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
    {links.map(({ to, text, exact = false }) => (
      <MenuItem
        key={to}
        to={to}
        onClick={toggleHamburgerMenu}
        exact={exact}
      >
        {text}
      </MenuItem>
    ))}
  </Menu>
);

HamburgerMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onStateChange: PropTypes.func.isRequired,
  outerContainerId: PropTypes.string.isRequired,
  pageWrapId: PropTypes.string.isRequired,
  toggleHamburgerMenu: PropTypes.func.isRequired,
};

const MenuItem = ({
  children, onClick, to, exact,
}) => (
  (to.startsWith('http') || to.startsWith('mailto:'))
    ? <a className={styles.menuItem} href={to}>{children}</a>
    : (
      <NavLink
        className={styles.menuItem}
        activeClassName={styles.active}
        to={to}
        onClick={onClick}
        exact={exact}
      >
        {children}
      </NavLink>
    )
);

MenuItem.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  to: PropTypes.string.isRequired,
  exact: PropTypes.bool.isRequired,
};

MenuItem.defaultProps = {
  onClick: () => {},
};

export default HamburgerMenu;
