import React from 'react';
import PropTypes from 'prop-types';
import * as typeformEmbed from '@typeform/embed';

import styles from './GuideList.scss';

import ImgCovid from './assets/Covid19.jpg';
import ImgEviction from './assets/EvictionPrevention.jpg';
import ImgAffordableHousing from './assets/AffordableHousing.jpg';
import ImgFamilyHomelessness from './assets/FamilyHomelessness.jpg';
import ImgYouthHomelessness from './assets/YouthHomelessness.jpg';
import ImgAdultHomelessness from './assets/AdultHomelessness.jpg';

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
  img, link, name,
}) => (
  <a
    className={styles.cardLink}
    role="button"
    onClick={e => { typeform(e, link); }}
    href
  >
    <div className={styles.card}>
      <img
        className={styles.cardImage}
        src={img}
        alt={name}
      />
      <div className={styles.cardTextWrapper}>
        <div className={styles.cardText}>
          {name}
          <a className={styles.cardLinkText} role="button" href>
          Explore Guide →
          </a>
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
          name="Coronavirus COVID-19"
          link="https://docs.google.com/document/d/e/2PACX-1vRhUk0r7xAFbcb-XnMbLXXK64rv_KXsoQElDmDxyP1GwpuveNsxHOo2CiVDHf-956Njom83Xd7VkJXn/pub?embedded=true"
          img={ImgCovid}
        />
      </li>
      <li className={styles.item}>
        <GuideCard
          name="Eviction Prevention"
          link="https://sheltertech.typeform.com/to/AuWYAN"
          img={ImgEviction}
        />
      </li>
      <li className={styles.item}>
        <GuideCard
          name="Affordable Housing"
          link="https://sheltertech.typeform.com/to/w8R0b8"
          img={ImgAffordableHousing}
        />
      </li>
      <li className={styles.item}>
        <GuideCard
          name="Family Homelessness"
          link="https://sheltertech.typeform.com/to/GFEzl2"
          img={ImgFamilyHomelessness}
        />
      </li>
      <li className={styles.item}>
        <GuideCard
          name="Youth Homelessness"
          link="https://sheltertech.typeform.com/to/mXv584"
          img={ImgYouthHomelessness}
        />
      </li>
      <li className={styles.item}>
        <GuideCard
          name="Adult Homelessness"
          link="https://sheltertech.typeform.com/to/KXi3Pp"
          img={ImgAdultHomelessness}
        />
      </li>
    </ul>
  </div>
);

export default GuideList;
