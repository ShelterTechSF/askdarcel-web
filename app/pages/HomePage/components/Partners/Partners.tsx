import React from "react";
import { Link } from "react-router-dom";

import "./Partners.scss";
import STLogo from "./assets/STLogo.png";
import JDCLogo from "./assets/JDCLogo.png";
import MOHCDLogo from "./assets/MOHCDLogo.png";
import BenetechLogo from "./assets/BenetechLogo.png";
import Our415Logo from "../../../../assets/img/Our415_logo-hori.svg";
import BridgeLogo from "./assets/BridgeLogo.png";
import DcNavLogo from "../../../../assets/img/DcNavAcuteCareLogo.jpg";

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
          href="https://www.sfbar.org/jdc/jdc-legal-services-programs/hap/"
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
        <a href="https://www.our415.org/" rel="noopener">
          <img src={Our415Logo} alt="Our 415" className="our415Logo" />
        </a>
      </li>
      <li>
        <header />
        <a href="https://acutecare.ucsf.edu/" rel="noopener">
          <img src={DcNavLogo} alt="Acute Care Lab Discharge Navigator" />
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
