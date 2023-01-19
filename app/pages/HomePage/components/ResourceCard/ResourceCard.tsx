import React from 'react';
import { useHistory } from 'react-router-dom';
import { icon as assetIcon } from 'assets';

import styles from './ResourceCard.module.scss';

export interface Resource {
  link?: string;
  name?: string;
  icon?: string;
  categorySlug?: string;
}

const ResourceCard = ({ resource }: { resource: Resource }) => {
  const { link = '', name = '', icon = '', categorySlug } = resource;

  const history = useHistory();

  let anchorTagProps;

  if (categorySlug) {
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
    <a className={styles.card} {...anchorTagProps}>
      <img src={assetIcon(icon)} alt={name} className={styles.icon} />
      <span className={styles.name}>{name}</span>
    </a>
  );
};

export default ResourceCard;
