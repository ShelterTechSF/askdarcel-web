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

export const TwoColumnContentSection = ({ contentBlock }: any) => {
  return (
    <section className={styles.twoColumnContentSectionContainer}>
      <BlockContent
        blocks={contentBlock}
        serializers={serializers}
        className="2-col-content-section"
      />
    </section>
  );
};
