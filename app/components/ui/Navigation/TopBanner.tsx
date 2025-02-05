import React from "react";
import { GoogleTranslate } from "../GoogleTranslate";
import classNames from "classnames";
import styles from "./TopBanner.module.scss";

const TopBanner = () => {
  return (
    <div className={classNames(styles.topBanner, "no-print")}>
      <GoogleTranslate />
    </div>
  );
};

export default TopBanner;
