import React from "react";
import { whiteLabel } from "../../../utils";

import { Footer } from "../../../components/ui";

import styles from "../AboutPage.module.scss";
import STLogo from "../assets/STLogo.png";
import MOHCDLogo from "../assets/MOHCDLogo.png";
import JDCLogo from "../assets/JDCLogo.png";
import BenetechLogo from "../assets/BenetechLogo.png";
import Our415Logo from "../../../assets/img/Our415_logo-hori.svg";
import BridgeLogo from "../assets/BridgeLogo.png";
import LarkinLogo from "../assets/LarkinLogo.png";
import CompassLogo from "../assets/Compass.png";
import EDCLogo from "../assets/EDC.png";
import AcuteCareLogo from "../../../assets/img/ucsf-acute-care-innovation-center-logo.png";
import HomeownershipSFLogo from "../assets/HomeownershipSF.png";

const { aboutPageText, aboutPageTitle } = whiteLabel;

export const SfServiceGuide = () => (
  <div className={styles.about}>
    <article className={styles.textPage} id="about">
      <header className={styles.aboutHeader}>
        <h1>
          About the
          <br />
          {aboutPageTitle}
        </h1>
        <p>{aboutPageText} </p>
      </header>
      <section className={styles.aboutSection}>
        <h3>Powered by:</h3>
        <div className={styles.aboutRow}>
          <a
            href="http://sheltertech.org"
            rel="noopener"
            className={styles.imageContainer}
          >
            <img src={STLogo} alt="ShelterTech" />
          </a>
          <p>
            The {aboutPageTitle} is developed and maintained by ShelterTech, a
            volunteer-only 501c(3) non-profit that builds tech products for
            homeless and at risk communities.{" "}
            <a href="http://sheltertech.org" rel="noopener">
              Learn more here.
            </a>
          </p>
        </div>
      </section>
      <section className={styles.aboutSection}>
        <h3>In partnership with:</h3>
        <div className={styles.aboutRow}>
          <a
            href="https://sfmohcd.org/"
            rel="noopener"
            className={styles.imageContainer}
          >
            <img src={MOHCDLogo} alt="MOHCD" />
          </a>
          <p>
            The {aboutPageTitle} is supported by a grant from the SF
            Mayor&apos;s Office of Housing and Community Development.
          </p>
        </div>
        <div className={styles.aboutRow}>
          <a
            href="https://www.sfbar.org/jdc/jdc-legal-services-programs/hap/"
            rel="noopener"
            className={styles.imageContainer}
          >
            <img src={JDCLogo} alt="JDC" />
          </a>
          <p>
            The content on the site is verified for accuracy by our data
            partner, the Homeless Advocacy Project of the JDC.
          </p>
        </div>
      </section>
      <section className={styles.aboutSection}>
        <h3>Strategic partners:</h3>
        <ul className={styles.partnersList}>
          <li>
            <a href="https://larkinstreetyouth.org/" rel="noopener">
              <img src={LarkinLogo} alt="Larkin Street Youth Services" />
            </a>
          </li>
          <li>
            <a href="http://evictiondefense.org/" rel="noopener">
              <img src={EDCLogo} alt="Eviction Defenese Collaborative" />
            </a>
          </li>
          <li>
            <a href="https://homeownershipsf.org/" rel="noopener">
              <img src={HomeownershipSFLogo} alt="Homeownership SF" />
            </a>
          </li>
          <li>
            <a href="https://www.compass-sf.org/" rel="noopener">
              <img src={CompassLogo} alt="Compass SF" />
            </a>
          </li>
          <li>
            <a href="https://benetech.org/" rel="noopener">
              <img src={BenetechLogo} alt="Benetech" />
            </a>
          </li>
          <li>
            <a href="https://www.our415.org/" rel="noopener">
              <img
                src={Our415Logo}
                alt="Our 415"
                className={styles.our415Logo}
              />
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
      </section>
    </article>
    <Footer />
  </div>
);
