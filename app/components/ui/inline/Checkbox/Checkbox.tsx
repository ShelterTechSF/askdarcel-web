import React from "react";

import styles from "./Checkbox.module.scss";

type CheckboxProps = {
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  checked?: boolean;
  addClass?: string;
  id?: string;
  addLabel?: boolean;
};

export const Checkbox = ({
  name,
  onChange,
  value,
  checked,
  addClass,
  id,
  addLabel,
}: CheckboxProps) => (
  <>
    <input
      name={name}
      onChange={onChange}
      value={value}
      checked={checked}
      className={`${styles.inputDefaults} ${addClass || ""}`}
      id={id}
      type="checkbox"
    />
    {addLabel && (
      <label className={styles.label} htmlFor={id}>
        {name}
      </label>
    )}
  </>
);
