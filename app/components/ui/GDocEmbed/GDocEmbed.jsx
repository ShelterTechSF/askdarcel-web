import React from 'react';
import PropTypes from 'prop-types';
import Iframe from 'react-iframe';
import Footer from '../Footer/Footer';

import styles from './GDocEmbed.scss';


export default class GDocEmbed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { pageHeader } = this.props;
    const { GDocURL } = this.props;
    return (
      <React.Fragment>
        <article className={styles.GPage}>
          <header className={styles.GHeader}>
            <h1>
              {pageHeader}
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
              title={pageHeader}
              url={GDocURL}
              width="80%"
              height="100%"
              padding="0pt"
              allowFullScreen="yes"
              className={styles.GDocEmbed}
            />
          </section>
        </article>
        <Footer />
      </React.Fragment>
    );
  }
}

GDocEmbed.propTypes = {
  pageHeader: PropTypes.string.isRequired,
};
