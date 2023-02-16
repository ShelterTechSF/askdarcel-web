import React from "react";
import { useHistory } from "react-router-dom";

import { icon as assetIcon } from "assets";
import { Section } from "components/ucsf/Section/Section";
import { Layout } from "components/ucsf/Layout/Layout";

import styles from "./UcsfHomePage.module.scss";

const UCSF_RESOURCES = [
  {
    id: "2000001",
    name: "Mental Health",
    icon: "smiley-face",
    checked: false,
    slug: "ucsf-mental-health-resources",
  },
  {
    id: "2000002",
    name: "Shelter",
    icon: "bed",
    checked: false,
    slug: "ucsf-shelter-resources",
  },
  {
    id: "2000003",
    name: "Substance Use",
    icon: "hospital",
    checked: false,
    slug: "ucsf-substance-use-resources",
  },
  {
    id: "2000004",
    name: "Food Insecurity",
    icon: "food",
    checked: false,
    slug: "ucsf-food-insecurity-resources",
  },
  {
    id: "2000005",
    name: "Immigration",
    icon: "globe",
    checked: false,
    slug: "ucsf-immigration-resources",
  },
];

interface ResourceItem {
  id: string;
  name: string;
  icon: string;
  checked: boolean;
  slug: string;
}

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

const ResourceCard = ({resource}: {
  resource: ResourceItem;
}) => {
  const history = useHistory();
  const goToNextStep = (selectedResourceSlug: string) => {
    history.push("/find-services", { selectedResourceSlug });
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
