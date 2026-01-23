import React from "react";
import { icon } from "assets";
import styles from "./Banner.module.scss";

export const Banner = () => (
  <div className={styles.bannerContainer}>
    <div className={styles.bannerContent}>
      <img src={icon("alert")} alt="attention" className={styles.alertIcon} />
      <div>
        <strong className={styles.title}>
          HELP IDENTIFY AND STOP HUMAN TRAFFICKING
        </strong>
        <p>
          <a
            className={styles.bannerLink}
            target="_blank"
            rel="noreferrer"
            href="https://www.sf.gov/help-identify-and-stop-human-trafficking"
          >
            Resources
          </a>{" "}
          for victims of human trafficking.
        </p>
      </div>
    </div>
  </div>
);
