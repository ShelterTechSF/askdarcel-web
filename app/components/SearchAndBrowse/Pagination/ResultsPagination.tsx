import React from "react";
import { Pagination } from "react-instantsearch";
import websiteConfig from "utils/websiteConfig";
import classNames from "classnames";
import styles from "./ResultsPagination.module.scss";

const {
  appImages: { algolia },
} = websiteConfig;

const ResultsPagination = ({ noResults }: { noResults?: boolean }) => (
  <div>
    <div
      className={classNames(
        styles.paginationContainer,
        "no-print",
        noResults ? styles.hidePagination : ""
      )}
    >
      <div className={styles.resultsPagination}>
        <Pagination
          padding={2}
          showLast={false}
          showFirst={false}
          translations={{
            previousPageItemText: "Prev",
            nextPageItemText: "Next",
          }}
        />
      </div>
      <div className={styles.algoliaImgWrapper}>
        <img src={algolia} alt="Search by Algolia" />
      </div>
    </div>
  </div>
);

export default ResultsPagination;
