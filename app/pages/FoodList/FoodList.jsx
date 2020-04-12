import React from 'react';
import Iframe from 'react-iframe';
import Footer from '../../components/ui/Footer/Footer';

import styles from './FoodList.scss';


// Disable max line length rule, since this file is mostly just text-heavy HTML
// content.
/* eslint-disable max-len */

export default class FoodList extends React.Component {
  render() {
    return (
      <div>
        <article className={styles.covidPage}>
          <header className={styles.covidHeader}>
            <h1>
              Food resources for Individuals-In-Need
            </h1>
            <p>
              This list is compiled to link individuals experiencing homelessness to resources.
              We will be updating the list continuously, when services change.
              <br />
              Please email
              <a href="mailto:contact@sheltertech.org">
                {' '}
                contact@sheltertech.org
              </a>
              {' '}
              to suggest edits.
            </p>
          </header>
          <div className={styles.foodBannerContainer}>
            <a href="./FoodMap">
              View the San Francisco Food Resource Map
            </a>
          </div>
          <section>
            <Iframe
              title="Covid-19 food resource guide"
              url="https://docs.google.com/document/d/e/2PACX-1vSHQD1ro1zVMn8M7i0VB58G4GG47YJqbP5a4le9ycDHeoSDVL6anaUj0ZOkRxfRX4nW4N_O2R8k8i7n/pub?embedded=false"
              width="80%"
              height="100%"
              padding="0pt"
              allowFullScreen="yes"
              className={styles.covidDocEmbed}
            />
          </section>
        </article>
        <Footer />
      </div>
    );
  }
}
