import React from "react";
import classNames from "classnames";
import styles from "./LabelTag.module.scss";

// This component relies on the shape and naming conventions of data Shelter
// Tech syncs to Algolia which distinguishes service and organization results
// with a "type" field. It's unlikely this will change without our knowledge but developers
// should be aware of the possibility.
//
// THOUGHT: replacing with enum if another type is added
const SHELTER_TECH_TYPE_FOR_ORGANIZATION = "resource";
const SHELTER_TECH_TYPE_FOR_SERVICE = "service";

export const LabelTag = ({ label }: { label: string }) => {
  if (label === SHELTER_TECH_TYPE_FOR_ORGANIZATION) {
    return (
      <span className={classNames(styles.labelTag, styles.organizationType)}>
        Organization
      </span>
    );
  }

  if (label === SHELTER_TECH_TYPE_FOR_SERVICE) {
    return (
      <span className={classNames(styles.labelTag, styles.serviceType)}>
        Service
      </span>
    );
  }

  return <span className={classNames(styles.labelTag)}>{label}</span>;
};
