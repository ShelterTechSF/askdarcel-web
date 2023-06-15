import React from "react";
import { Footer } from "../../../components/ui";

import styles from "../AboutPage.module.scss";
import STLogo from "../assets/STLogo.png";
import MOHCDLogo from "../assets/MOHCDLogo.png";
import JDCLogo from "../assets/JDCLogo.png";
import BenetechLogo from "../assets/BenetechLogo.png";
import Our415Logo from "../../../assets/img/Our415_logo-hori.svg";
import BridgeLogo from "../assets/BridgeLogo.png";
import LarkinLogo from "../assets/LarkinLogo.png";
import WeworkLogo from "../assets/WeworkLogo.png";
import CompassLogo from "../assets/Compass.png";
import EDCLogo from "../assets/EDC.png";
import HomeownershipSFLogo from "../assets/HomeownershipSF.png";
import ZenDeskLogo from "../assets/ZenDeskLogo.jpg";
import TLTechLabLogo from "../assets/TLTechLabLogo.png";

export const LinkSf = () => (
  <div className={styles.about}>
    <article className={styles.textPage} id="about">
      <header className={styles.aboutHeader}>
        <h1>About Link-SF</h1>
        <p>
          Launched in 2014, Link-SF is San Francisco’s first mobile-optimized,
          location-based resource directory for individuals and families who are
          low-income, experiencing homelessness, and/or underserved. The guide’s
          focus is on homelessness and housing services, but also covers a
          variety of other resources, from education and legal aid to senior
          services and re-entry programs. Created through a collaboration
          between St. Anthony’s Tenderloin Technology Lab and Zendesk, Link-SF
          is easy to use for everyday people and service providers alike, and
          accessible through any device with internet access
        </p>
        <p>
          Link-SF was originally designed and implemented by St. Anthony’s and
          Zendesk. This collaboration emerged as a result of the Community
          Benefits Agreement in the Mid-Market revitalization project in the
          city of San Francisco. St. Anthony’s Tenderloin Technology Lab reached
          out to the tech community after observing an increase in the use of
          smart phones by low-income residents. The result was Link-SF, which
          uses mobile technology to assist those most in need. As of October
          2021, the directory is run by ShelterTech as part of its SF Service
          Guide online directory.
        </p>
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
            Link-SF is developed and maintained by ShelterTech, a volunteer-only
            501c(3) non-profit that builds tech products for homeless and at
            risk communities.{" "}
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
            href="https://www.stanthonysf.org/services/tech-lab/"
            rel="noopener"
            className={styles.imageContainer}
          >
            <img src={TLTechLabLogo} alt="MOHCD" />
          </a>
          <p>
            St. Anthony’s
            <a
              href="https://www.stanthonysf.org/services/tech-lab/"
              rel="noopener"
            >
              {" "}
              Tenderloin Technology Lab (TTL){" "}
            </a>
            is the neighborhood’s only free technology center, providing
            computer access and education to all. Committed to bridging the
            digital divide, we believe that everyone deserves access to the
            tools of modern life — whether they want to build employment skills,
            access other free resources in the Bay Area, or connect and
            reconnect with family and friends. The TTL was a founding partner in
            the creation of Link-SF.
          </p>
        </div>

        <div className={styles.aboutRow}>
          <a
            href="https://www.zendesk.com/"
            rel="noopener"
            className={styles.imageContainer}
          >
            <img src={ZenDeskLogo} alt="MOHCD" />
          </a>
          <p>
            Zendesk started the customer experience revolution in 2007 by
            enabling any business around the world to take their customer
            service online. Today, Zendesk is the champion of great service
            everywhere for everyone, and powers billions of conversations,
            connecting more than 100,000 brands with hundreds of millions of
            customers over telephony, chat, email, messaging, social channels,
            communities, review sites and help centers. Zendesk products are
            built with love to be loved. The company was conceived in
            Copenhagen, Denmark, built and grown in California, taken public in
            New York City, and today employs more than 5,000 people across the
            world. Zendesk was a founding partner in the creation of Link-SF.
          </p>
        </div>

        <div className={styles.aboutRow}>
          <a
            href="https://sfmohcd.org/"
            rel="noopener"
            className={styles.imageContainer}
          >
            <img src={MOHCDLogo} alt="MOHCD" />
          </a>
          <p>
            The Link-SF and SF Service Guide is supported by a grant from the SF
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
              <img src={EDCLogo} alt="WeWork" />
            </a>
          </li>
          <li>
            <a href="https://homeownershipsf.org/" rel="noopener">
              <img src={HomeownershipSFLogo} alt="WeWork" />
            </a>
          </li>
          <li>
            <a href="https://www.compass-sf.org/" rel="noopener">
              <img src={CompassLogo} alt="WeWork" />
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
            <img src={BridgeLogo} alt="Bridge" />
          </li>
          <li>
            <a href="https://www.wework.com" rel="noopener">
              <img src={WeworkLogo} alt="WeWork" />
            </a>
          </li>
        </ul>
      </section>
    </article>
    <Footer />
  </div>
);
