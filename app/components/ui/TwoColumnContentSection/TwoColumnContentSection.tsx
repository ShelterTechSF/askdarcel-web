import React from "react";
import imageUrlBuilder from "@sanity/image-url";
import styles from "./TwoColumnContentSection.module.scss";
import { client } from "../../../sanity";

const builder = imageUrlBuilder(client);

const BlockContent = require("@sanity/block-content-to-react");

export const TwoColumnContentSection = (props: any) => {
  return (
    <section className={styles.twoColumnContentSectionContainer}>
      <div
        className={
          props.mediaAlignment === "left"
            ? styles.imageContainer_left
            : styles.imageContainer_right
        }
      >
        <img
          className={styles.image}
          src={builder.image(props.image).url()}
          alt={props.imageAlt}
        />
      </div>
      <BlockContent
        blocks={props.contentBlock}
        className={
          props.mediaAlignment === "left"
            ? styles.contentContainer_left
            : styles.contentContainer_right
        }
      />
    </section>
  );
};
