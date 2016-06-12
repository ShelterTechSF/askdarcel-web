import React from 'react';

let bgImage = require('../assets/images/bg.png');
let smallLogo = require('../assets/images/logo-small-white@3x.png');

function LargeHeader() {
  return (
    <header className="header-large">
      <nav className="navbar navbar-default" role="navigation">
        <a className="navbar-brand" href="#">
          <img src={'assets/images/logo-small-white@3x.png'} alt="Ask Darcel"/>
        </a>
      </nav>
      <div className="push"></div>
      <div className="hero" style={{backgroundImage: 'url(' + 'assets/images/bg.png' +')'}} role="banner">
        <h1>
          Find the best community<br />
          resources for your needs
        </h1>
        <div className="search-container form-row" role="search">
          <input type="text" className="search-field" placeholder="I'm looking for..." name="srch-term" id="srch-term" />
          <input type="text" className="location-field" placeholder="Near me" name="srch-location" id="srch-location" />
          <button id="largeheader_searchbutton" className="button search" type="submit"><i className="material-icons">search</i> Search</button>
        </div>
      </div>
    </header>

  );
}

export default LargeHeader;
