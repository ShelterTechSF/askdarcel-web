import React from 'react';
import { images } from 'assets';

function WhiteLabel() {
  return (
    <div className="white-label">
      <div className="white-label-seal">
        <img src={images.mohcdSeal} alt="MOCHD Seal" />
      </div>
      <div className="white-label-content">
        <div className="mohcd-info">
          <p>help.sfgov.org is a project of the</p>
          <a href="https://sfmohcd.org/" target="_blank" rel="noopener noreferrer">Mayor's Office of Housing and Community Development</a>
        </div>
        <div className="shelter-tech-info">
          <p>in partnership with</p>
          <a href="https://sheltertech.org" target="_blank" rel="noopener noreferrer">ShelterTech</a>
        </div>
      </div>
    </div>
  );
}

export default WhiteLabel;
