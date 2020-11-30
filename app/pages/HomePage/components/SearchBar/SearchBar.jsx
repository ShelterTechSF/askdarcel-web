import React from 'react';
import PropTypes from 'prop-types';

import styles from './SearchBar.module.scss';

const SearchBar = ({
  onChange, onSubmit, placeholder, value,
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

SearchBar.propTypes = {
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
};

SearchBar.defaultProps = {
  onSubmit: () => {},
  placeholder: undefined,
};

export default SearchBar;
