import React from "react";
import styles from "./SingleColumnContentSection.module.scss";
import { SingleColumnContentBlockResponse } from "hooks/StrapiAPI";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

/**
 * Renders a single column content section that primarily wraps Strapi's
 * `BlocksRenderer` component.
 */
export const SingleColumnContentSection = (
  props: SingleColumnContentBlockResponse
) => {
  const { content } = props;

  return (
    <section
      className={styles.singleColumnContentSectionContainer}
      data-testid={"single-column-content-section"}
    >
      <div className={styles.innerContainer}>
        <BlocksRenderer content={content} />
      </div>
    </section>
  );
};
