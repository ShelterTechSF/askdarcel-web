import React from 'react';
import Iframe from 'react-iframe';
import Footer from '../../components/ui/Footer/Footer';

import styles from './Covid.scss';


// Disable max line length rule, since this file is mostly just text-heavy HTML
// content.
/* eslint-disable max-len */

export default class Covid extends React.Component {
  render() {
    return (
      <div className={styles.about}>
        <article className={styles.textPage} id="about">
          <header className={styles.aboutHeader}>
            <h1>
              SF Service Guide
              <br />
              COVID-19 resource guide
            </h1>
            <p>
              This is living document from
              {' '}
              <a href="ShelterTech.org">ShelterTech</a>
              {' '}
of resources for individuals experiencing homelessness. We will be updating the list continuously, when services change, to ensure you have the most up to date information.
              Please email
              {' '}
              <a href="contact@sheltertech.org">contact@sheltertech.org</a>
              {' '}
to suggest edits.
              See what types of places are open or closed at
              {' '}
              <a href="sf.gov/stay-home-except-essential-needs">sf.gov/stay-home-except-essential-needs</a>
            </p>
          </header>
          <section className={styles.aboutSection}>
            <Iframe
              url="https://docs.google.com/document/d/e/2PACX-1vRhUk0r7xAFbcb-XnMbLXXK64rv_KXsoQElDmDxyP1GwpuveNsxHOo2CiVDHf-956Njom83Xd7VkJXn/pub?embedded=true"
              width="100%"
              height="100%"
              className={styles.covidDocEmbed}
            />
          </section>
        </article>
        <Footer />
      </div>
    );
  }
}
