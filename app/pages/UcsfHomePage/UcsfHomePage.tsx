import React from "react";
import { useHistory } from "react-router-dom";

import { icon as assetIcon } from "assets";
import { Section } from "components/ucsf/Section/Section";
import { Layout } from "components/ucsf/Layout/Layout";

import { UCSF_RESOURCES, ResourceItem } from "./ucsfResourceConstants";

import styles from "./UcsfHomePage.module.scss";

const ResourceListComponent = ({
  resourceList,
}: {
  resourceList: ResourceItem[];
}) => (
  <ul className={styles.resourceList}>
    {resourceList.map((resource: ResourceItem) => (
      <ResourceCard key={resource.id} resource={resource} />
    ))}
  </ul>
);

const ResourceCard = ({ resource }: { resource: ResourceItem }) => {
  const history = useHistory();
  const goToNextStep = (selectedResourceSlug: string) => {
    history.push(`/find-services/${selectedResourceSlug}`);
  };

  return (
    <li
      className={`${styles.resourceCard}
          ${resource.checked ? styles.isChecked : ""}`}
    >
      <button
        type="button"
        className={styles.cardButton}
        onClick={() => {
          goToNextStep(resource.slug);
        }}
      >
        <img
          src={assetIcon(resource.icon)}
          alt={resource.name}
          className={styles.icon}
        />
        <p className={styles.resourceName}>{resource.name}</p>
      </button>
    </li>
  );
};

const Page = () => (
  <div className={styles.ucsfHomePage}>
    <Section title="For Clinicians" />
    <Section
      addClass={styles.subtitleMargin}
      subtitle="Step 1: What kind of assistance does your client need?"
    />
    <ResourceListComponent resourceList={UCSF_RESOURCES} />
  </div>
);

export const UcsfHomePage = () => (
  <Layout>
    <Page />
  </Layout>
);
