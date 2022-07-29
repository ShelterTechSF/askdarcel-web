import React, { ReactNode } from 'react';

import styles from './Layout.module.scss';

export const Layout = ({ children }: {
  children: ReactNode;
}) => (
  <div className={styles.grid}>
    {children}
  </div>
);
