import React from 'react';

import styles from './Checkbox.module.scss';

type CheckboxProps = {
  name?: string;
  placeholderText?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  checked?: boolean;
  addClass?: string;
  id?: string;
};

const Input = ({
  name,
  placeholderText,
  onChange,
  value,
  checked,
  addClass,
  id,
}: CheckboxProps) => (
  <input
    name={name}
    placeholder={placeholderText}
    onChange={onChange}
    value={value}
    checked={checked}
    className={`${styles.inputDefaults} ${addClass || ''}`}
    id={id}
    type="checkbox"
  />
);

export default Input;
