import React from "react";
import classNames from "classnames";
import styles from "./DetailInfoSection.module.scss";

type DetailInfoSectionProps = {
  title: string;
  borderBottom?: boolean;
} & React.HTMLProps<HTMLDivElement>;

export const DetailInfoSection = ({
  children,
  title,
  borderBottom = true,
  ...props
}: DetailInfoSectionProps) => {
  const sectionClassnames = classNames(
    styles.detailInfoSection,
    borderBottom && styles.borderBottom
  );

  return (
    <section className={sectionClassnames} {...props}>
      <h2>{title}</h2>
      {children}
    </section>
  );
};
