import React from "react";
import styles from "./NavigatorDashboard.module.scss";

export const NavigatorDashboard = () => {
  return (
    <div>
      <div className={styles.advancedSearchContainer}>
        <h1 className={styles.greeting}>Hi, Case Managers :)</h1>
        <p className={styles.blurb}>
          Please use the search bar to find specific resources for the homeless
          individuals you are assisting. You can enter keywords, such as
          &ldquo;shelter,&ldquo; &ldquo;food assistance,&ldquo; or
          &ldquo;employment support,&ldquo; to discover relevant programs and
          services.
        </p>
      </div>
    </div>
  );
};
