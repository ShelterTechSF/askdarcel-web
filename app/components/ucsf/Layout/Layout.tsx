import React, { ReactNode } from 'react';

import styles from './Layout.module.scss';

const Section = ({ children }: {
  children: ReactNode;
}) => (
  <div className={styles.grid}>
    {children}
  </div>
);

export default Section;
