import React from "react";
import styles from "./Masthead.module.scss";

export const Masthead = ({ title }: { title: string | undefined }) => {
  return (
    <div className={styles.mastheadContainer}>
      <div className={styles.innerContainer}>
        <h1 className={styles.mastheadHeader}>{title}</h1>
      </div>
    </div>
  );
};
