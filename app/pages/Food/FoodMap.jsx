import React from 'react';
import Iframe from 'react-iframe';

import styles from './FoodMap.scss';


// Disable max line length rule, since this file is mostly just text-heavy HTML
// content.
/* eslint-disable max-len */

export default class Covid extends React.Component {
  render() {
    return (
      <div>
        <article className={styles.FoodMap__Page} id="covid">
          <section>
            <Iframe
              url="https://sfgov.maps.arcgis.com/apps/webappviewer/index.html?id=bb080a525416426c9f96057a00367b4d"
              allowFullScreen="yes"
              className={styles.FoodMap__DocEmbed}
            />
          </section>
        </article>
      </div>
    );
  }
}
