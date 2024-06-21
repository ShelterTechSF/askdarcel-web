import React from "react";
import { SanityImageSource } from "@sanity/image-url/lib/types/types.d";
import BlockContent, {
  BlockContentProps,
} from "@sanity/block-content-to-react";
import imageUrlBuilder from "@sanity/image-url";
import styles from "./TwoColumnContentSection.module.scss";
import { client } from "../../../sanity";
import { Button } from "../inline/Button/Button";

const builder = imageUrlBuilder(client);

const BlockRenderer = (props: {
  node: { style: string };
  children: React.ReactNode;
}) => {
  const { node, children } = props;
  const { style = "normal" } = node;
  if (style === "h1") {
    return <h1 className="heading-1"> {children} </h1>;
  }
  if (style === "h2") {
    return <h2 className="heading-2"> {children} </h2>;
  }
  if (style === "h3") {
    return <h3 className="heading-3"> {children} </h3>;
  }
  if (style === "h4") {
    return <h4 className="heading-4"> {children} </h4>;
  }
  if (style === "normal") {
    return <p className="subheading-medium"> {children} </p>;
  }
  // Don't want to ts-ignore anything, but hopefully usage of block-content-to-react is temporary and we'll
  // use a non deprecated version of the tool that has better ts support soon.
  // @ts-ignore
  return BlockContent.defaultSerializers.types.block(props);
};

export interface TwoColumnContent {
  mediaAlignment: string;
  image: SanityImageSource;
  imageAlt: string | undefined;
  contentBlock: BlockContentProps;
  contentLinkButtonText: string;
  contentLinkButtonUrl: string;
  _id: string;
}

export const TwoColumnContentSection = ({
  image,
  imageAlt,
  contentBlock,
  mediaAlignment,
  contentLinkButtonText,
  contentLinkButtonUrl,
}: TwoColumnContent) => {
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
        <BlockContent
          className={styles.contentBlock}
          blocks={contentBlock}
          serializers={{ types: { block: BlockRenderer } }}
        />
        {contentLinkButtonText && (
          <div className={styles.contentLinkButton}>
            <Button href={contentLinkButtonUrl} arrowVariant="after">
              {contentLinkButtonText}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
