import React from 'react';
import { Footer } from '../../components/ui';
import whiteLabel from '../../utils/whitelabel';

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
import ZenDeskLogo from './assets/ZenDeskLogo.jpg';
import TLTechLabLogo from './assets/TLTechLabLogo.png';


// Disable max line length rule, since this file is mostly just text-heavy HTML content.
/* eslint-disable max-len */

export const AboutPage = () => {
  const { title } = whiteLabel;

  // Default about page markup is defined here. Markup for white label providers is
  // defined below. Todo: DRY-ify markup to the extent reasonable?
  let aboutPageMarkup = (
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

  if (title === 'Link SF') {
    aboutPageMarkup = (
      <div className={styles.about}>
        <article className={styles.textPage} id="about">
          <header className={styles.aboutHeader}>
            <h1>
              About Link-SF
            </h1>
            <p>
              Launched in 2014, Link-SF is San Francisco’s first mobile-optimized, location-based resource directory for individuals and families who are low-income, experiencing homelessness, and/or underserved. The guide’s focus is on homelessness and housing services, but also covers a variety of other resources, from education and legal aid to senior services and re-entry programs. Created through a collaboration between St. Anthony’s Tenderloin Technology Lab and Zendesk, Link-SF is easy to use for everyday people and service providers alike, and accessible through any device with internet access
            </p>
            <p>
              Link-SF was originally designed and implemented by St. Anthony’s and Zendesk. This collaboration emerged as a result of the Community Benefits Agreement in the Mid-Market revitalization project in the city of San Francisco. St. Anthony’s Tenderloin Technology Lab reached out to the tech community after observing an increase in the use of smart phones by low-income residents. The result was Link-SF, which uses mobile technology to assist those most in need. As of October 2021, the directory is run by ShelterTech as part of its SF Service Guide online directory.
            </p>
          </header>
          <section className={styles.aboutSection}>
            <h3>Powered by:</h3>
            <div className={styles.aboutRow}>
              <a href="http://sheltertech.org" rel="noopener norefferer" className={styles.imageContainer}>
                <img src={STLogo} alt="ShelterTech" />
              </a>
              <p>
                Link-SF is developed and maintained by ShelterTech, a volunteer-only 501c(3) non-profit that builds tech products for homeless and at risk communities.
                {' '}
                <a href="http://sheltertech.org" rel="noopener norefferer">Learn more here.</a>
              </p>
            </div>
          </section>
          <section className={styles.aboutSection}>
            <h3>In partnership with:</h3>

            <div className={styles.aboutRow}>
              <a href="https://www.tenderlointechnologylab.org/" rel="noopener norefferer" className={styles.imageContainer}>
                <img src={TLTechLabLogo} alt="MOHCD" />
              </a>
              <p>
                St. Anthony’s
                <a href="https://www.tenderlointechnologylab.org/" rel="noopener norefferer">Tenderloin Technology Lab (TTL)</a>
                is the neighborhood’s only free technology center, providing computer access and education to all. Committed to bridging the digital divide, we believe that everyone deserves access to the tools of modern life — whether they want to build employment skills, access other free resources in the Bay Area, or connect and reconnect with family and friends. The TTL was a founding partner in the creation of Link-SF.
              </p>
            </div>

            <div className={styles.aboutRow}>
              <a href="https://www.zendesk.com/" rel="noopener norefferer" className={styles.imageContainer}>
                <img src={ZenDeskLogo} alt="MOHCD" />
              </a>
              <p>
                Zendesk started the customer experience revolution in 2007 by enabling any business around the world to take their customer service online. Today, Zendesk is the champion of great service everywhere for everyone, and powers billions of conversations, connecting more than 100,000 brands with hundreds of millions of customers over telephony, chat, email, messaging, social channels, communities, review sites and help centers. Zendesk products are built with love to be loved. The company was conceived in Copenhagen, Denmark, built and grown in California, taken public in New York City, and today employs more than 5,000 people across the world. Zendesk was a founding partner in the creation of Link-SF.
              </p>
            </div>

            <div className={styles.aboutRow}>
              <a href="https://sfmohcd.org/" rel="noopener norefferer" className={styles.imageContainer}>
                <img src={MOHCDLogo} alt="MOHCD" />
              </a>
              <p>
                The Link-SF and SF Service Guide is supported by a grant from the SF Mayor&apos;s Office of Housing and Community Development.
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
  }

  return aboutPageMarkup;
};
