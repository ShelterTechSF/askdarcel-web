import React from 'react';

import styles from './SearchBar.module.scss';

export const SearchBar = ({
  onChange, onSubmit = () => {}, placeholder, value,
}: {
  onChange: (newValue: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  value: string;
}) => (
  <form
    className={styles.form}
    role="search"
    onSubmit={event => { event.preventDefault(); onSubmit(); }}
  >
    <div className={styles.textInputWrapper}>
      <input
        type="text"
        value={value}
        className={styles.textInput}
        placeholder={placeholder}
        onChange={event => onChange(event.target.value)}
      />
    </div>
    <div className={styles.submitWrapper}>
      <button className={styles.submit} type="submit">
        Search
      </button>
    </div>
  </form>
);
