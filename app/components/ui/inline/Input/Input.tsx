import React from 'react';

import styles from "./Input.module.scss";

type InputProps = {
  name?: string;
  placeholderText?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  checked?: boolean;
  classesString?: string;
  id?: string;
  type: string;
};

const Input = ({
  name,
  placeholderText,
  onChange,
  value,
  checked,
  classesString,
  id,
  type,
}: InputProps) => {
  return (
    <input
      name={name}
      placeholder={placeholderText}
      onChange={onChange}
      value={value}
      checked={checked}
      className={`${styles.inputDefaults} ${classesString}`}
      id={id}
      type={type}
    />
  );
};

export default Input;