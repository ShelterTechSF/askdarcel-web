import React from 'react';
import PropTypes from 'prop-types';
import * as typeformEmbed from '@typeform/embed';

import styles from './GuideList.scss';

import ImgCovid from './assets/Covid19.jpg';
// import ImgEviction from './assets/EvictionPrevention.jpg';
// import ImgAffordableHousing from './assets/AffordableHousing.jpg';
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
  img, link, name, isTypeform = false,
}) => {
  // if this is typeform, we open the typeform modal on click.
  // Otherwise, we just attach the link as an href.
  const anchorTagProps = isTypeform ? {
    role: 'button',
    onClick: e => { typeform(e, link); },
  } : {
    href: link,
  };

  return (
    <a
      className={styles.cardLink}
      {...anchorTagProps}
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
};

GuideCard.propTypes = {
  name: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};

const GuideList = () => (
  <div className={styles.wrapper}>
    <ul className={styles.list}>
      <li className={styles.item}>
        <GuideCard
          name="San Francisco EOC Food Resources"
          link="/foodmap"
          img={ImgCovid}
          isTypeform={false}
        />
      </li>
      {/* Note: these resource guides have temporarily been disabled due to covid.
      Leaving them here commented out so that they can easily be re-enabled at a later date */}
      {/* <li className={styles.item}>
        <GuideCard
          name="Eviction Prevention"
          link="https://sheltertech.typeform.com/to/AuWYAN"
          img={ImgEviction}
          isTypeform
        />
      </li> */}
      {/* <li className={styles.item}>
        <GuideCard
          name="Affordable Housing"
          link="https://sheltertech.typeform.com/to/w8R0b8"
          img={ImgAffordableHousing}
          isTypeform
        />
      </li> */}
      <li className={styles.item}>
        <GuideCard
          name="Family Homelessness"
          link="https://sheltertech.typeform.com/to/GFEzl2"
          img={ImgFamilyHomelessness}
          isTypeform
        />
      </li>
      <li className={styles.item}>
        <GuideCard
          name="Youth Homelessness"
          link="https://sheltertech.typeform.com/to/mXv584"
          img={ImgYouthHomelessness}
          isTypeform
        />
      </li>
      <li className={styles.item}>
        <GuideCard
          name="Adult Homelessness"
          link="https://sheltertech.typeform.com/to/KXi3Pp"
          img={ImgAdultHomelessness}
          isTypeform
        />
      </li>
    </ul>
  </div>
);

export default GuideList;
