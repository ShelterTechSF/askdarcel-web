
import React from 'react';
import { Link } from 'react-router';
let bgImage = require('../assets/images/bg.png');
let smallLogo = require('../assets/images/logo-small-white@3x.png');

function Header() {
  return (
	<nav className="navbar navbar-default header_root" style={{backgroundImage: 'url(' + bgImage +')'}}>
        <div className="container-fluid">
            <div className="navbar-header">
                <a className="navbar-brand" href="#">
                    <img src={smallLogo} />
                </a>
            </div>
        </div>
    </nav>
  );
}

export default Header;
