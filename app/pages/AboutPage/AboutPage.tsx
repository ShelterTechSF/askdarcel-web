import React from 'react';
import Footer from '../../components/ui/Footer/Footer';

import styles from './AboutPage.module.scss';

import STLogo from './assets/STLogo.png';
import MOHCDLogo from './assets/MOHCDLogo.png';
import JDCLogo from './assets/JDCLogo.png';
import BenetechLogo from './assets/BenetechLogo.png';
import SFFamiliesLogo from './assets/SFFamiliesLogo.png';
import BridgeLogo from './assets/BridgeLogo.png';
import LarkinLogo from './assets/LarkinLogo.png';
import WeworkLogo from './assets/WeworkLogo.png';
import CompassLogo from './assets/Compass.png';
import EDCLogo from './assets/EDC.png';
import HomeownershipSFLogo from './assets/HomeownershipSF.png';


// Disable max line length rule, since this file is mostly just text-heavy HTML content.
/* eslint-disable max-len */

export const AboutPage = () => (
  <div className={styles.about}>
    <article className={styles.textPage} id="about">
      <header className={styles.aboutHeader}>
        <h1>
          About the
          <br />
          SF Service Guide
        </h1>
        <p>The SF Service Guide is an online directory of human services in San Francisco. Our goal is to help anyone with access to a smartphone, tablet, or computer find the services they need. The guide&apos;s focus is on homelessness and housing services, but also covers a variety of other services, from education and legal aid to senior services and re-entry programs. </p>
      </header>
      <section className={styles.aboutSection}>
        <h3>Powered by:</h3>
        <div className={styles.aboutRow}>
          <a href="http://sheltertech.org" rel="noopener norefferer" className={styles.imageContainer}>
            <img src={STLogo} alt="ShelterTech" />
          </a>
          <p>
            The SF Service Guide is developed and maintained by ShelterTech, a volunteer-only 501c(3) non-profit that builds tech products for homeless and at risk communities.
            {' '}
            <a href="http://sheltertech.org" rel="noopener norefferer">Learn more here.</a>
          </p>
        </div>
      </section>
      <section className={styles.aboutSection}>
        <h3>In partnership with:</h3>
        <div className={styles.aboutRow}>
          <a href="https://sfmohcd.org/" rel="noopener norefferer" className={styles.imageContainer}>
            <img src={MOHCDLogo} alt="MOHCD" />
          </a>
          <p>
            The SF Service Guide is supported by a grant from the SF Mayor&apos;s Office of Housing and Community Development.
          </p>
        </div>
        <div className={styles.aboutRow}>
          <a href="http://www.sfbar.org/jdc/legal-services/hap/" rel="noopener norefferer" className={styles.imageContainer}>
            <img src={JDCLogo} alt="JDC" />
          </a>
          <p>
            The content on the site is verified for accuracy by our data partner, the Homeless Advocacy Project of the JDC.
          </p>
        </div>
      </section>
      <section className={styles.aboutSection}>
        <h3>Strategic partners:</h3>
        <ul className={styles.partnersList}>
          <li><a href="https://larkinstreetyouth.org/" rel="noopener norefferer"><img src={LarkinLogo} alt="Larkin Street Youth Services" /></a></li>
          <li><a href="http://evictiondefense.org/" rel="noopener norefferer"><img src={EDCLogo} alt="WeWork" /></a></li>
          <li><a href="https://homeownershipsf.org/" rel="noopener norefferer"><img src={HomeownershipSFLogo} alt="WeWork" /></a></li>
          <li><a href="https://www.compass-sf.org/" rel="noopener norefferer"><img src={CompassLogo} alt="WeWork" /></a></li>
          <li><a href="https://benetech.org/" rel="noopener norefferer"><img src={BenetechLogo} alt="Benetech" /></a></li>
          <li><a href="https://www.sffamilies.org/" rel="noopener norefferer"><img src={SFFamiliesLogo} alt="SF Families" /></a></li>
          <li><img src={BridgeLogo} alt="Bridge" /></li>
          <li><a href="https://www.wework.com" rel="noopener norefferer"><img src={WeworkLogo} alt="WeWork" /></a></li>
        </ul>
      </section>
    </article>
    <Footer />
  </div>
);
