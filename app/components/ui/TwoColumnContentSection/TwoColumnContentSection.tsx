import React from "react";
import styles from "./TwoColumnContentSection.module.scss";

const BlockContent = require("@sanity/block-content-to-react");

const serializers = {
  types: {
    code: (props) => (
      <pre data-language={props?.node?.language}>
        <code>{props.node?.code}</code>
      </pre>
    ),
  },
};

export const TwoColumnContentSection = (props: any) => {
  return (
    <section className={styles.twoColumnContentSectionContainer}>
      <div className={styles.left}>
        <BlockContent
          blocks={props.contentBlock}
          serializers={serializers}
          className={styles.twoColContentSection}
        />
      </div>
      <div className={styles.right}>
        <img
          className={styles.image}
          src="https://images.unsplash.com/photo-1717402779245-7f6ad2290ec7?q=80&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
      </div>
    </section>
  );
};
