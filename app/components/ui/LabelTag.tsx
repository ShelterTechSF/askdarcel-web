import React from "react";
import classNames from "classnames";
import styles from "./LabelTag.module.scss";

interface LabelTagProps {
  label: string;
  withTooltip?: boolean;
}

export const LabelTag = (props: LabelTagProps) => {
  const { label, withTooltip = false } = props;

  const tagClasses = classNames(
    styles.labelTag,
    withTooltip && styles.withTooltip
  );

  return <span className={tagClasses}>{label}</span>;
};
