import React from 'react';
import { useHistory } from 'react-router-dom';
import * as typeformEmbed from '@typeform/embed';
import { images } from 'assets';

import styles from './ResourceCard.module.scss';

const openTypeform = (event, link) => {
  const typeformReference = typeformEmbed.makePopup(
    link,
    {
      mode: 'popup',
      hideFooters: true,
    },
  );
  typeformReference.open();
};

const ResourceCard = ({ resource }) => {
  const {
    link = '', name = '', icon = '', categorySlug, isTypeform = false,
  } = resource;

  const history = useHistory();

  let anchorTagProps;

  if (isTypeform) {
    anchorTagProps = {
      role: 'button',
      onClick: e => { openTypeform(e, link); },
    };
  } else if (categorySlug) {
    anchorTagProps = {
      role: 'button',
      onClick: () => history.push(`/${categorySlug}/form`),
    };
  } else {
    anchorTagProps = {
      href: link,
      target: '_blank',
    };
  }

  return (
    <a
      className={styles.card}
      {...anchorTagProps}
    >
      <img src={images.icon(icon)} alt={name} className={styles.icon} />
      <span className={styles.name}>{name}</span>
    </a>
  );
};

export default ResourceCard;
