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
      <div>
        <article className={styles.covidPage} id="covid">
          <header className={styles.covidHeader}>
            <h1>
              Coronavirus resources for Individuals-In-Need
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
          <section>
            <Iframe
              title="Covid-19 Resource Guide"
              url="https://docs.google.com/document/d/e/2PACX-1vTGpgLJDTg3sm2XhyBoNUTNUhqJjTt5lEp8IXSP_yBNrxVgZ_zkmdKPo7JcKJTbduoTRt_dYnRV9xTB/pub?embedded=false"
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
