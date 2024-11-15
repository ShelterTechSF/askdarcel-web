import React from "react";
import { Helmet } from "react-helmet-async";
import { ActionSidebar } from "components/DetailPage";
import styles from "./DetailPageWrapper.module.scss";
import { OrganizationAction } from "models";

type DetailPageWrapperProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  sidebarActions: OrganizationAction[];
  onClickAction: (action: OrganizationAction) => void;
};

const DetailPageWrapper = ({
  title,
  description,
  children,
  sidebarActions,
  onClickAction,
}: DetailPageWrapperProps) => (
  <div className={styles[`detail-wrapper`]}>
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
    <article className={styles.detail} id="resource">
      <div className={styles["detail--main"]}>
        <div className={styles["detail--main--left"]}>{children}</div>
        <aside className={`${styles["detail--aside"]} no-print`}>
          <ActionSidebar
            actions={sidebarActions}
            onClickAction={onClickAction}
          />
        </aside>
      </div>
    </article>
  </div>
);

export default DetailPageWrapper;
