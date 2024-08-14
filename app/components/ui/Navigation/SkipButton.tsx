import React from "react";
import styles from "./SkipButton.module.scss";

// Skips to main content #main so user doesn't have to tab navigate through navbar on every new page

const SkipButton = () => {
  return (
    <a href="#main" className={styles.skipToMain}>
      Skip to main content
    </a>
  );
};

export default SkipButton;
