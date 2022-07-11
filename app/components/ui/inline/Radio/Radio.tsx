import React from 'react';

import styles from './Radio.module.scss';

type RadioProps = {
  name: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  defaultChecked?: boolean;
  addClass?: string;
  id?: string;
};

export const Radio = ({
  name,
  onChange,
  value,
  defaultChecked,
  addClass,
  id,
}: RadioProps) => (
  <input
    name={name}
    onChange={onChange}
    value={value}
    defaultChecked={defaultChecked}
    className={`${styles.radioDefaults} ${addClass || ''}`}
    id={id}
    type="radio"
  />
);
