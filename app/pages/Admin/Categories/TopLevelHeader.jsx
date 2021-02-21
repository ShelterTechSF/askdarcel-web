import React from 'react';

import styles from '.././Admin.module.scss';

const TopLevelHeader = (props) => {
  return (
    <div className={styles.topLevelHeader}>
      <span>Top Level Categories</span>
      <span>+ Add Category</span>
    </div>
  )
}

export default TopLevelHeader;