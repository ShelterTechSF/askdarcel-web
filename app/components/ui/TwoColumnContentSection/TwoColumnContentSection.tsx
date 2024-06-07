import React from "react";
import BlockContent from "@sanity/block-content-to-react";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import imageUrlBuilder from "@sanity/image-url";
import styles from "./TwoColumnContentSection.module.scss";
import { client } from "../../../sanity";

const builder = imageUrlBuilder(client);

export const TwoColumnContentSection = ({
  image,
  imageAlt,
  contentBlock,
  mediaAlignment,
  contentLinkButtonText,
  contentLinkButtonUrl,
}: {
  mediaAlignment: string;
  image: SanityImageSource;
  imageAlt: string | undefined;
  contentBlock: any;
  contentLinkButtonText: string;
  contentLinkButtonUrl: string;
}) => {
  return (
    <section className={styles.twoColumnContentSectionContainer}>
      <div
        className={
          mediaAlignment === "left"
            ? styles.imageContainer_left
            : styles.imageContainer_right
        }
      >
        <img
          className={styles.image}
          src={builder.image(image).url()}
          alt={imageAlt}
        />
      </div>
      <div
        className={
          mediaAlignment === "left"
            ? styles.contentContainer_left
            : styles.contentContainer_right
        }
      >
        <BlockContent className={styles.contentBlock} blocks={contentBlock} />
        <a className={styles.contentLinkButton} href={contentLinkButtonUrl}>
          {contentLinkButtonText}
        </a>
      </div>
    </section>
  );
};
