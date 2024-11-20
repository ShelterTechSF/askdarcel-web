import React from "react";
import { Button } from "./inline/Button/Button";
import styles from "./PageNotFound.module.scss";

const PageNotFound = () => {
  return (
    <div>
      <h1>Page not found</h1>
      <p className={styles.description}>
        We’re sorry, but the page you’re looking for can’t be found. The URL may
        be misspelled or the page you’re looking for is no longer available.
      </p>
      <Button href="/" arrowVariant="after">
        Go to the homepage
      </Button>
    </div>
  );
};

export default PageNotFound;
