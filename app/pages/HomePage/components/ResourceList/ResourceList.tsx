import React from "react";

import ResourceCard from "../ResourceCard/ResourceCard";
import type { Resource } from "../ResourceCard/ResourceCard";
import styles from "./ResourceList.module.scss";

const ResourceList = ({ resources }: { resources: Resource[] }) => (
  <ul className={styles.list}>
    {resources.map((resource) => (
      <ResourceCard key={resource.name} resource={resource} />
    ))}
  </ul>
);

export default ResourceList;
