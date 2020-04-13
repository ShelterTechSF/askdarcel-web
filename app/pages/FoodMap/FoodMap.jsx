import React from 'react';
import Iframe from 'react-iframe';

import styles from './FoodMap.scss';

import ImgSFGovLogo from './assets/SFGovLogo.png';

export default class FoodMap extends React.Component {
  render() {
    return (
      <div>
        <div className={styles.foodBannerContainer}>
          <a href="./FoodList">
            View highlighted resources in SFServiceGuide
          </a>
        </div>
        <article className={styles.mapContainer}>
          <div className={styles.foodMapBannerCredit}>
            <img
              className={styles.SFGovLogo}
              src={ImgSFGovLogo}
              alt="SF Gov logo"
            />
            <span>
              San Francisco EOC Food Resource Map
            </span>
          </div>
          <section>
            <Iframe
              title="Covid-19 Food Guide"
              url="https://sfgov.maps.arcgis.com/apps/webappviewer/index.html?id=bb080a525416426c9f96057a00367b4d"
              allowFullScreen="yes"
              padding="0pt"
              className={styles.embedMap}
            />
          </section>
        </article>
      </div>
    );
  }
}
