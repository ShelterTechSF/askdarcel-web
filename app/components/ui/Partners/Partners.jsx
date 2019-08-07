import React from 'react';
import { Link } from 'react-router';
import './Partners.scss';
import STLogo from './assets/STLogo.png';
import MOHCDLogo from './assets/MOHCDLogo.png';
import JDCLogo from './assets/JDCLogo.png';

const Partners = () => (
  <div className="partners">
    <ul>
      <li>
        <header>Powered By:</header>
        <a href="http://sheltertech.org" rel="noopener norefferer" className="image-container">
          <img src={STLogo} alt="ShelterTech" />
        </a>
      </li>
      <li>
        <header>In Partnership With:</header>
        <a href="https://sfmohcd.org/" rel="noopener norefferer" className="image-container">
          <img src={MOHCDLogo} alt="MOHCD" />
        </a>
      </li>
      <li>
        <header />
        <a href="http://www.sfbar.org/jdc/legal-services/hap/" rel="noopener norefferer" className="image-container">
          <img src={JDCLogo} alt="JDC" />
        </a>
      </li>
    </ul>
    <Link to="/about">View all our strategic partners</Link>
  </div>
);

export default Partners;
