import React, { forwardRef } from "react";
import { TransformedSearchHit } from "models";
import { Link } from "react-router-dom";
import { LabelTag } from "components/ui/LabelTag";
import { formatPhoneNumber, renderAddressMetadata } from "utils";
import { removeAsterisksAndHashes } from "utils/strings";
import ReactMarkdown from "react-markdown";
import styles from "./SearchResults.module.scss";

interface SearchResultProps {
  hit: TransformedSearchHit;
}

export const SearchResult = forwardRef<HTMLDivElement, SearchResultProps>(
  (props, ref) => {
    const { hit } = props;

    return (
      // ref is for focusing on the first search hit when user paginates and scrolls to top
      <div className={styles.searchResult} ref={ref} tabIndex={-1}>
        <div className={styles.searchResultContentContainer}>
          <div>
            <div className={styles.titleContainer}>
              <div>
                <h2 className={styles.title}>
                  {hit.resultListIndexDisplay}.{" "}
                  <Link
                    to={{ pathname: hit.path }}
                    className={`notranslate ${styles.titleLink}`}
                  >
                    {hit.name}
                  </Link>
                </h2>
                {hit.type === "service" && (
                  <div className={styles.serviceOf}>
                    <Link
                      to={`/organizations/${hit.resource_id}`}
                      className={`notranslate ${styles.serviceOfLink}`}
                    >
                      {hit.service_of}
                    </Link>
                  </div>
                )}
              </div>
              <div className={styles.searchResultSubcatContainer}>
                <LabelTag label={hit.type} />
              </div>
            </div>
          </div>
          <div className="print-only">
            <p>
              <strong>Call:</strong> {hit.phoneNumber}
            </p>
            <p>
              <strong>Website:</strong> {hit.websiteUrl}
            </p>
          </div>
          <div className={styles.searchResultContent}>
            <div className={styles.searchText}>
              <div className={`notranslate ${styles.address}`}>
                {renderAddressMetadata(hit)}
              </div>
              {/* Once we can update all dependencies, we can add remarkBreaks as remarkPlugin here */}
              <ReactMarkdown
                className={`rendered-markdown ${styles.description}`}
                linkTarget="_blank"
              >
                {hit.longDescription
                  ? removeAsterisksAndHashes(hit.longDescription)
                  : ""}
              </ReactMarkdown>
            </div>
          </div>
        </div>
        <div className={`${styles.sideLinks} no-print`}>
          {hit.phoneNumber && (
            <a
              href={`tel:${hit.phoneNumber}`}
              className={`${styles.icon} ${styles["icon-phone"]}`}
              title={`Call ${formatPhoneNumber(hit.phoneNumber)}`}
            >
              <span className="sr-only">
                Call {formatPhoneNumber(hit.phoneNumber)}
              </span>
            </a>
          )}
          {hit.websiteUrl && (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={hit.websiteUrl}
              className={`${styles.icon} ${styles["icon-popout"]}`}
              title="Go to website"
            >
              <span className="sr-only">Go to website</span>
            </a>
          )}
        </div>
      </div>
    );
  }
);
