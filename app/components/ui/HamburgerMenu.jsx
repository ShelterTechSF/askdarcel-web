import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
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
  { to: '/', text: 'Home' },
  { to: '/about', text: 'About' },
  { to: 'https://sheltertech.org/volunteer', text: 'Volunteer' },
  { to: 'mailto:info@sheltertech.org', text: 'Email Us' },
  { to: 'https://www.facebook.com/ShelterTechOrg/', text: 'Facebook' },
  { to: 'https://twitter.com/sheltertechorg', text: 'Twitter' },
  { to: '/terms-of-service', text: 'Terms of Service' },
  { to: '/privacy-policy', text: 'Privacy Policy' },
];

const HamburgerMenu = ({
  isOpen,
  location,
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
    {links.map(({ to, text }) => (
      <MenuItem
        key={to}
        to={to}
        isActive={location.pathname === to}
        onClick={toggleHamburgerMenu}
      >
        {text}
      </MenuItem>
    ))}
  </Menu>
);

HamburgerMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  onStateChange: PropTypes.func.isRequired,
  outerContainerId: PropTypes.string.isRequired,
  pageWrapId: PropTypes.string.isRequired,
  toggleHamburgerMenu: PropTypes.func.isRequired,
};

const MenuItem = ({
  children, isActive, onClick, to,
}) => (
  (to.startsWith('http') || to.startsWith('mailto:'))
    ? <a className={styles.menuItem} href={to}>{children}</a>
    : <Link className={`${styles.menuItem} ${isActive ? styles.active : ''}`} to={to} onClick={onClick}>{children}</Link>
);

MenuItem.propTypes = {
  children: PropTypes.node.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
  to: PropTypes.string.isRequired,
};

MenuItem.defaultProps = {
  onClick: () => {},
};

export default HamburgerMenu;
