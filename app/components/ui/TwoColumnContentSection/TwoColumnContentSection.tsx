import React from "react";
import styles from "./TwoColumnContentSection.module.scss";
// import { PortableText } from "@portabletext/react";

/*
 video or image has a different order
 how to pass in the content block?
 */

export const TwoColumnContentSection = ({ title }: any) => {
  return (
    <section className={styles.twoColumnContentSectionContainer}>
      <h3>{title}</h3>
      {/* <PortableText */}
      {/*   value={ */}
      {/*     [ */}
      {/*       /\* array of portable text blocks *\/ */}
      {/*     ] */}
      {/*   } */}
      {/* /> */}
    </section>
  );
};
