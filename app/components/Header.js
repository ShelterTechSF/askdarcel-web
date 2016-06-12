
import React from 'react';
import { Link } from 'react-router';
let smallLogo = require('../assets/images/logo-small-white@3x.png');

function Header() {
  return (
	<header>
    <nav className="navbar navbar-default" role="navigation">
      <a className="navbar-brand" href="#">
        <img src={smallLogo} alt="Ask Darcel"/>
      </a>
    </nav>
  </header>
  );
}

export default Header;
