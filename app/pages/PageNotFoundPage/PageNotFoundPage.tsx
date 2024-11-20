import React from "react";
import PageNotFound from "components/ui/PageNotFound";
import styles from "./PageNotFoundPage.module.scss";

export const PageNotFoundPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <PageNotFound />
      </div>
    </div>
  );
};
