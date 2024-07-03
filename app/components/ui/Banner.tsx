import React from "react";
import { icon } from "assets";
import styles from "./Banner.module.scss";

export const Banner = () => (
  <div className={styles.bannerContainer}>
    <div className={styles.bannerContent}>
      <img src={icon("alert")} alt="attention" className={styles.alertIcon} />
      <div>
        <strong className={styles.title}>
          SHELTER ACCESS DURING HEAT RISK WEATHER:
        </strong>
        <p>
          <a
            className={styles.bannerLink}
            target="_blank"
            rel="noreferrer"
            href="https://t.e2ma.net/message/evwfxh/mhfrepid"
          >
            Get information
          </a>{" "}
          on expanded shelter access during heat risk weather in San Francisco.
        </p>
        <p>
          <a
            className={styles.bannerLink}
            target="_blank"
            rel="noreferrer"
            href="https://hsh.sfgov.org/services"
          >
            General information
          </a>{" "}
          on finding temporary shelter.
        </p>
      </div>
    </div>
  </div>
);
