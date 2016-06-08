import React from 'react';

function LargeHeader() {
  return (
    <header className="header-large">
      <nav className="navbar navbar-default">
        <a className="navbar-brand" href="#">
          <img src={'assets/images/logo-small-white@3x.png'} />
        </a>
      </nav>
      <div className="push"></div>
      <div className="hero" style={{backgroundImage: 'url(' + 'assets/images/bg.png' +')'}}>
        <h1>
          Find the best community<br />
          resources for your needs
        </h1>
        <div className="search-container form-row">
          <input type="text" className="search-field" placeholder="I'm looking for..." name="srch-term" id="srch-term" />
          <button id="largeheader_searchbutton" className="button search" type="submit"><i className="material-icons">search</i> Search</button>
        </div>
      </div>
    </header>

  );
}

export default LargeHeader;
