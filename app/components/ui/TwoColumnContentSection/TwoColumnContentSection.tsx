import React from "react";
import styles from "./TwoColumnContentSection.module.scss";
import { Button } from "../inline/Button/Button";
import { TwoColumnContentBlock } from "models/Strapi";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

/**
 * Displays a section with two columns, typically text next to media
 *
 * TODO: media can be a video URL, update component to handle
 * TODO: update use srcset and the different media sizes for images
 */
export const TwoColumnContentSection = (props: TwoColumnContentBlock) => {
  const { link, content, media_align, media, title } = props;
  const altText = media?.data?.attributes?.alternativeText || "";

  return (
    <section
      className={styles.twoColumnContentSectionContainer}
      data-testid={"two-column-content-section"}
    >
      <div
        className={
          media_align === "left"
            ? styles.contentContainer_left
            : styles.contentContainer_right
        }
      >
        <div className={styles.innerContainer}>
          {title && <h2>{title}</h2>}
          <div className={styles.contentBlock}>
            <BlocksRenderer content={content || []} />
          </div>
          {link && (
            <div className={styles.contentLinkButton}>
              <Button href={link.url} arrowVariant="after">
                {link.text}
              </Button>
            </div>
          )}
        </div>
      </div>
      <div
        className={
          media_align === "left"
            ? styles.imageContainer_left
            : styles.imageContainer_right
        }
      >
        <img
          className={styles.image}
          src={media?.data?.attributes?.url ?? ""}
          alt={altText}
        />
      </div>
    </section>
  );
};
