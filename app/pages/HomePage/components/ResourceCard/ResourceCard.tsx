import React from 'react';
import { useHistory } from 'react-router-dom';
import * as typeformEmbed from '@typeform/embed';
import { icon as assetIcon } from 'assets';

import styles from './ResourceCard.module.scss';

const openTypeform = (link: string): void => {
  const typeformReference = typeformEmbed.makePopup(
    link,
    {
      mode: 'popup',
      hideFooters: true,
    },
  );
  typeformReference.open();
};

export interface Resource {
  link?: string;
  name?: string;
  icon?: string;
  categorySlug?: string;
  isTypeform?: boolean;
}

const ResourceCard = ({ resource }: { resource: Resource }) => {
  const {
    link = '', name = '', icon = '', categorySlug, isTypeform = false,
  } = resource;

  const history = useHistory();

  let anchorTagProps;

  if (isTypeform) {
    anchorTagProps = {
      role: 'button',
      onClick: () => { openTypeform(link); },
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
      <img src={assetIcon(icon)} alt={name} className={styles.icon} />
      <span className={styles.name}>{name}</span>
    </a>
  );
};

export default ResourceCard;
