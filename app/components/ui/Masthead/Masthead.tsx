import React from "react";
import styles from "./Masthead.module.scss";

export const Masthead = (props: { title: string | undefined }) => {
  return (
    <div className={styles.mastheadContainer}>
      <h1 className={styles.mastheadHeader}>{props.title}</h1>
    </div>
  );
};
