import React from 'react';

import styles from './Section.module.scss';

const Section = ({ title, body }: {
  title: string;
  body?: string;
}) => (
  <section className={styles.section}>
    <h1 className={styles.title}>{ title }</h1>
    {body && <p className={styles.body}>{ body }</p>}
  </section>
);

export default Section;
