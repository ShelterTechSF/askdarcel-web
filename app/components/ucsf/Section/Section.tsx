import React from 'react';

import styles from './Section.module.scss';

const Section = ({ title, subtitle, body, addClass }: {
  title?: string;
  subtitle?: string;
  body?: string;
  addClass?: string;
}) => (
  <section className={`${styles.section} ${addClass || ''}`}>
    <h1 className={styles.title}>{ title }</h1>
    <h2 className={styles.subtitle}>{ subtitle }</h2>
    {body && <p className={styles.body}>{ body }</p>}
  </section>
);

export default Section;
