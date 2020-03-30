import React from 'react';
import PropTypes from 'prop-types';
import * as typeformEmbed from '@typeform/embed';

import styles from './GuideList.scss';

import ImgCovid from './assets/Covid19.jpg';
import ImgEviction from './assets/EvictionPrevention.jpg';
import ImgEvictionPartner from './assets/logos/EDC.png';
import ImgAffordableHousing from './assets/AffordableHousing.jpg';
import ImgAffordableHousingPartner from './assets/logos/homeownershipsf.png';
import ImgFamilyHomelessness from './assets/FamilyHomelessness.jpg';
import ImgYouthHomelessness from './assets/YouthHomelessness.jpg';
import ImgYouthHomelessnessPartner from './assets/logos/larkin.png';
import ImgAdultHomelessness from './assets/AdultHomelessness.jpg';
import ImgAdultHomelessnessPartner from './assets/logos/JDC.png';
import ImgFamilyHomelessnessPartner from './assets/logos/compass.png';

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
        {partner && (
        <div className={styles.cardPartner}>
          <small>In partnership with</small>
          <img
            className={styles.cardPartnerImage}
            src={partnerImg}
            alt={partner}
          />
        </div>
        )}
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
          name="Coronavirus COVID-19"
          link="/covid"
          img={ImgCovid}
        />
      </li>
      <li className={styles.item}>
        <GuideCard
          name="Eviction Prevention"
          link="https://sheltertech.typeform.com/to/AuWYAN"
          img={ImgEviction}
          partner="Eviction Defense Collaborative"
          partnerImg={ImgEvictionPartner}
        />
      </li>
      <li className={styles.item}>
        <GuideCard
          name="Affordable Housing"
          link="https://sheltertech.typeform.com/to/w8R0b8"
          img={ImgAffordableHousing}
          partner="Homeownership SF"
          partnerImg={ImgAffordableHousingPartner}
        />
      </li>
      <li className={styles.item}>
        <GuideCard
          name="Family Homelessness"
          link="https://sheltertech.typeform.com/to/GFEzl2"
          img={ImgFamilyHomelessness}
          partner="Compass Family Services"
          partnerImg={ImgFamilyHomelessnessPartner}
        />
      </li>
      <li className={styles.item}>
        <GuideCard
          name="Youth Homelessness"
          link="https://sheltertech.typeform.com/to/mXv584"
          img={ImgYouthHomelessness}
          partner="Larkin Street Youth Services"
          partnerImg={ImgYouthHomelessnessPartner}
        />
      </li>
      <li className={styles.item}>
        <GuideCard
          name="Adult Homelessness"
          link="https://sheltertech.typeform.com/to/KXi3Pp"
          img={ImgAdultHomelessness}
          partner="Homeless Advocacy Project"
          partnerImg={ImgAdultHomelessnessPartner}
        />
      </li>
    </ul>
  </div>
);

export default GuideList;
