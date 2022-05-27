import React from 'react';

import styles from "./Styles.module.scss";

type InputProps = {
  name?: string;
  placeholderText?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  classesString?: string;
  id?: string;
  type: string;
};

const Input = ({
  name,
  placeholderText,
  onChange,
  value,
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
      className={`${styles.inputDefaults} ${classesString}`}
      id={id}
      type={type}
    />
  );
};

export default Input;