import React from 'react';

import styles from './Checkbox.module.scss';

type CheckboxProps = {
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  addClass?: string;
  id?: string;
  dataField?: string;
};

export const Checkbox = ({
  name,
  onChange,
  value,
  checked,
  defaultChecked,
  addClass,
  id,
  dataField,
}: CheckboxProps) => (
  <input
    name={name}
    onChange={onChange}
    value={value}
    checked={checked}
    defaultChecked={defaultChecked}
    className={`${styles.inputDefaults} ${addClass || ''}`}
    id={id}
    data-field={dataField}
    type="checkbox"
  />
);
