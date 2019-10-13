import React from 'react';
import PropTypes from 'prop-types';
import * as typeformEmbed from '@typeform/embed';

import styles from './GuideList.scss';

import ImgEviction from './assets/EvictionPrevention.jpg';
import ImgEvictionPartner from './assets/logos/EDC.png';
import ImgAffordableHousing from './assets/AffordableHousing.jpg';
import ImgAffordableHousingPartner from './assets/logos/homeownershipsf.png';
import ImgYouthHomelessness from './assets/YouthHomelessness.jpg';
import ImgYouthHomelessnessPartner from './assets/logos/larkin.png';
import ImgAdultHomelessness from './assets/AdultHomelessness.jpg';
import ImgAdultHomelessnessPartner from './assets/logos/JDC.png';

function typeform(event, link) {
  const typeformReference = typeformEmbed.makePopup(
    link,
    {
      mode: 'popup',
      hideFooters: true,
    },
  );
  typeformReference.open();
}

const GuideCard = ({
  img, link, name, partner, partnerImg,
}) => (
  <a className={styles.cardLink} role="button" onClick={e => { typeform(e, link); }} href>
    <div className={styles.card}>
      <img
        className={styles.cardImage}
        src={img}
        alt={name}
      />
      <div className={styles.cardTextWrapper}>
        <div className={styles.cardText}>
          {name}
          <a className={styles.cardLinkText} role="button" onClick={e => { typeform(e, link); }} href>
          Explore Guide →
          </a>
        </div>
        <div className={styles.cardPartner}>
          <small>In partnership with</small>
          <img
            className={styles.cardPartnerImage}
            src={partnerImg}
            alt={partner}
          />
        </div>
      </div>
    </div>
  </a>
);

GuideCard.propTypes = {
  name: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};

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
