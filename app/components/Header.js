
import React from 'react';
import { Link } from 'react-router';
import { images } from '../assets';

function Header() {
  return (
	<header>
    <nav className="navbar" role="navigation">
      <a className="navbar-brand" href="/">
        <img src={images.logoSmall} alt="Ask Darcel"/>
      </a>
      <div className="nav-search">
        <div className="form-row" role="search">
          <input type="text" className="search-field" placeholder="I'm looking for..." name="srch-term" id="srch-term" />
        </div>
      </div>
    </nav>
    <div className="push"></div>
  </header>
  );
}

export default Header;
