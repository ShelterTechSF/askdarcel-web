import React from "react";
import { Link } from "react-router-dom";
import { Service } from "../../models";

export const ServiceCard = ({ service }: { service: Service }) => {
  const { id, name, long_description } = service;
  return (
    <Link to={{ pathname: `/services/${id}` }} className="card">
      <header className="content">
        <h3>{name}</h3>
        <p>{long_description}</p>
      </header>
    </Link>
  );
};
