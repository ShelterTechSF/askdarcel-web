import React from "react";
// import { icon } from "assets";
import styles from "./Masthead.module.scss";

export const Masthead = ({ title }) => {
  return (
    <div className={styles.mastheadContainer}>
      <h1 className={styles.mastheadHeader}>{title}</h1>
    </div>
  );
};
