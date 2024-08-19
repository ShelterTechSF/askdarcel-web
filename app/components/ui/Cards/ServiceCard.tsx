import { Service } from "models";
import React from "react";
import { Link } from "react-router-dom";
import styles from "./ServiceCard.module.scss";

type ServiceCardProps = Pick<Service, "id" | "name" | "long_description">;

export const ServiceCard = ({ service }: { service: ServiceCardProps }) => {
  const { id, name, long_description } = service;

  return (
    <Link to={{ pathname: `/services/${id}` }} className={styles.serviceCard}>
      <h3 className={styles.header}>{name}</h3>
      <p data-testid="service-card-description" className={styles.description}>
        {long_description}
      </p>
    </Link>
  );
};
