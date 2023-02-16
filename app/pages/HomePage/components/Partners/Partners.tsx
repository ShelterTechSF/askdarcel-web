import React from "react";
import { Link } from "react-router-dom";

import "./Partners.scss";
import STLogo from "./assets/STLogo.png";
import MOHCDLogo from "./assets/MOHCDLogo.png";
import JDCLogo from "./assets/JDCLogo.png";
import BenetechLogo from "./assets/BenetechLogo.png";
import SFFamiliesLogo from "./assets/SFFamiliesLogo.png";
import BridgeLogo from "./assets/BridgeLogo.png";

export const Partners = () => (
  <div className="partners">
    <ul>
      <li>
        <header>Powered By:</header>
        <a
          href="http://sheltertech.org"
          rel="noopener"
          className="image-container"
        >
          <img src={STLogo} alt="ShelterTech" />
        </a>
      </li>
      <li>
        <header>In Partnership With:</header>
        <a
          href="https://sfmohcd.org/"
          rel="noopener"
          className="image-container"
        >
          <img src={MOHCDLogo} alt="MOHCD" />
        </a>
      </li>
      <li>
        <header />
        <a
          href="http://www.sfbar.org/jdc/legal-services/hap/"
          rel="noopener"
          className="image-container"
        >
          <img src={JDCLogo} alt="JDC" />
        </a>
      </li>
      <li>
        <header />
        <a href="https://benetech.org/" rel="noopener">
          <img src={BenetechLogo} alt="Benetech" />
        </a>
      </li>
      <li>
        <header />
        <a href="https://www.sffamilies.org/" rel="noopener">
          <img src={SFFamiliesLogo} alt="SF Families" />
        </a>
      </li>
      <li>
        <header />
        <img src={BridgeLogo} alt="Bridge" />
      </li>
    </ul>
    <Link to="/about">View all our strategic partners</Link>
  </div>
);
