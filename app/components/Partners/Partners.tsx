import React from "react";
import { Link } from "react-router-dom";

import "./Partners.scss";
import Our415Logo from "assets/img/Our415_logo-hori.svg";
import AcuteCareLogo from "assets/img/ucsf-acute-care-innovation-center-logo.png";
import STLogo from "./assets/STLogo.png";
import JDCLogo from "./assets/JDCLogo.png";
import MOHCDLogo from "./assets/MOHCDLogo.png";
import BenetechLogo from "./assets/BenetechLogo.png";
import BridgeLogo from "./assets/BridgeLogo.png";

export const Partners = () => (
  <div className="partners">
    <div className="partnersLists">
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
      </ul>
      <ul>
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
          <a
            href="https://www.sfbar.org/jdc/jdc-legal-services-programs/hap/"
            rel="noopener"
            className="image-container"
          >
            <img src={JDCLogo} alt="JDC" />
          </a>
        </li>
        <li>
          <a href="https://benetech.org/" rel="noopener">
            <img src={BenetechLogo} alt="Benetech" />
          </a>
        </li>
        <li>
          <a href="https://www.our415.org/" rel="noopener">
            <img src={Our415Logo} alt="Our 415" className="our415Logo" />
          </a>
        </li>
        <li>
          <a href="https://acutecare.ucsf.edu/" rel="noopener">
            <img src={AcuteCareLogo} alt="Acute Care Innovation Center" />
          </a>
        </li>
        <li>
          <img src={BridgeLogo} alt="Bridge" />
        </li>
      </ul>
    </div>
    <Link to="/about">View all our strategic partners</Link>
  </div>
);
