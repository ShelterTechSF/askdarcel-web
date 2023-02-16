import React from "react";
import styles from "./Form.module.scss";

const Heading = ({ serviceName }: { serviceName: string }) => (
  <div>
    <h1 className={styles.title}>{`Text me information for ${serviceName}`}</h1>
    <h3 className={styles.description}>
      You will receive their address and phone number.
    </h3>
  </div>
);

export default Heading;
