import React from "react";
import { StrapiModel } from "models/Strapi";
import styles from "./TwoColumnContentSection.module.scss";
import { Button } from "../inline/Button/Button";

// TODO: media can be a video URL, update component to handle
// TODO: update use srcset and the different media sizes for images

export const TwoColumnContentSection = (
  props: StrapiModel.TwoColumnContentBlock
) => {
  const { link, content, media_alignment, media } = props;
  const altText = media[0].image?.data?.attributes?.alternativeText;

  return (
    <section className={styles.twoColumnContentSectionContainer}>
      <div
        className={
          media_alignment === "left"
            ? styles.imageContainer_left
            : styles.imageContainer_right
        }
      >
        <img
          className={styles.image}
          src={media[0].image?.data?.attributes?.url ?? ""}
          alt={altText}
        />
      </div>
      <div
        className={
          media_alignment === "left"
            ? styles.contentContainer_left
            : styles.contentContainer_right
        }
      >
        <div
          className={styles.contentBlock}
          dangerouslySetInnerHTML={{
            __html: content,
          }}
        />
        {link && (
          <div className={styles.contentLinkButton}>
            <Button href={link.url} arrowVariant="after">
              {link.text}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
