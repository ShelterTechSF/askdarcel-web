import React from 'react';
import PropTypes from 'prop-types';

import styles from './GuideList.scss';

import ImgEviction from './assets/EvictionPrevention.jpg';
import ImgEvictionPartner from './assets/logos/EDC.png';
import ImgAffordableHousing from './assets/AffordableHousing.jpg';
import ImgAffordableHousingPartner from './assets/logos/homeownershipsf.png';
import ImgYouthHomelessness from './assets/YouthHomelessness.jpg';
import ImgYouthHomelessnessPartner from './assets/logos/larkin.png';
import ImgAdultHomelessness from './assets/AdultHomelessness.jpg';
import ImgAdultHomelessnessPartner from './assets/logos/JDC.png';

const GuideCard = props => (
  <a className={styles.cardLink} href={props.link}>
    <div className={styles.card}>
      <img
        className={styles.cardImage}
        src={props.img}
        alt={props.name}
      />
      <div className={styles.cardTextWrapper}>
        <div className={styles.cardText}>
          {props.name}
          <a className={styles.cardLinkText} href={props.link}>
          Explore Guide →
          </a>
        </div>
        <div className={styles.cardPartner}>
          <small>In partnership with</small>
          <img
            className={styles.cardPartnerImage}
            src={props.partnerImg}
            alt={props.partner}
          />
        </div>
      </div>
    </div>
  </a>
);

const GuideList = () => (
  <div className={styles.wrapper}>
    <ul className={styles.list}>
      <li className={styles.item}>
        <GuideCard
          name="Eviction Prevention"
          link="https://rachelpoonsiriwong.typeform.com/to/mXv584"
          img={ImgEviction}
          partner="Eviction Defense Collaborative"
          partnerImg={ImgEvictionPartner}
        />
      </li>
      <li className={styles.item}>
        <GuideCard
          name="Affordable Housing"
          link="https://rachelpoonsiriwong.typeform.com/to/mXv584"
          img={ImgAffordableHousing}
          partner="Homeownership SF"
          partnerImg={ImgAffordableHousingPartner}
        />
      </li>
      <li className={styles.item}>
        <GuideCard
          name="Youth Homelessness"
          link="https://rachelpoonsiriwong.typeform.com/to/mXv584"
          img={ImgYouthHomelessness}
          partner="Larkin Street Youth Services"
          partnerImg={ImgYouthHomelessnessPartner}
        />
      </li>
      <li className={styles.item}>
        <GuideCard
          name="Adult Homelessness"
          link="https://rachelpoonsiriwong.typeform.com/to/mXv584"
          img={ImgAdultHomelessness}
          partner="Homeless Advocacy Project"
          partnerImg={ImgAdultHomelessnessPartner}
        />
      </li>
    </ul>
  </div>
);


export default GuideList;
