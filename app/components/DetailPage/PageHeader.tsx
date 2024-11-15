import React from "react";
import styles from "./PageHeader.module.scss";

type ListingPageHeaderProps = {
  title: string;
  children?: React.ReactNode;
  dataCy: string;
};

const ListingPageHeader = ({
  title,
  children,
  dataCy,
}: ListingPageHeaderProps) => (
  <header className={styles.pageHeader}>
    <h1 data-cy={dataCy} className="notranslate">
      {title}
    </h1>
    {children}
  </header>
);

export default ListingPageHeader;
