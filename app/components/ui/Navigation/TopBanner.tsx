import React from "react";
import { GoogleTranslate } from "../GoogleTranslate";
import styles from "./TopBanner.module.scss";

const TopBanner = () => {
  return (
    <div className={styles.topBanner}>
      <GoogleTranslate />
    </div>
  );
};

export default TopBanner;
