import React from "react";
import { Link } from "react-router-dom";
import { Service } from "../../../models";
import styles from "./ServiceCard.module.scss";

export const ServiceCard = ({ service }: { service: Service }) => {
  const { id, name, long_description } = service;

  return (
    <Link to={{ pathname: `/services/${id}` }} className={styles.serviceCard}>
      <h3 className={styles.header}>{name}</h3>
      <p className={styles.description}>{long_description}</p>
    </Link>
  );
};
