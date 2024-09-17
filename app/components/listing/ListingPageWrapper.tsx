import React from "react";
import { Helmet } from "react-helmet-async";
import { ActionSidebar } from "components/listing";
import styles from "./ListingPageWrapper.module.scss";
import { OrganizationAction } from "models";

type ListingPageWrapperProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  sidebarActions: OrganizationAction[];
  onClickAction: (action: OrganizationAction) => void;
};

const ListingPageWrapper = ({
  title,
  description,
  children,
  sidebarActions,
  onClickAction,
}: ListingPageWrapperProps) => (
  <div className={styles[`listing-wrapper`]}>
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
    <article className={styles.listing} id="resource">
      <div className={styles["listing--main"]}>
        <div className={styles["listing--main--left"]}>{children}</div>
        <aside className={`${styles["listing--aside"]} no-print`}>
          <ActionSidebar
            actions={sidebarActions}
            onClickAction={onClickAction}
          />
        </aside>
      </div>
    </article>
  </div>
);

export default ListingPageWrapper;
