import React from "react";
import { Loader } from "components/ui/Loader";
import { useFaqPageData } from "hooks/StrapiAPI";
import { Masthead } from "../../components/ui/Masthead/Masthead";
import { FaqPageContent, StrapiDatum } from "models/Strapi";
import Accordion from "components/ui/Accordions/Accordion";
import styles from "../../components/ui/TwoColumnContentSection/TwoColumnContentSection.module.scss";

/**
 * The FAQ page shares markup and styles with the `TwoColumnContentSection`
 * component. It is worth considering whether to abstract the two column content
 * section layout into a separate component that can receive either a
 * `TwoColumnContentBlock` or a `FaqPageContent` payload.
 */
export const FaqPage = () => {
  const { data, isLoading } = useFaqPageData();

  const res = data as StrapiDatum<FaqPageContent>;

  const pageData = res?.attributes || null;
  const image = {
    url: pageData?.image?.data?.attributes?.url,
    alternativeText:
      pageData?.image?.data?.attributes?.alternativeText ?? "FAQ page image",
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    pageData && (
      <div>
        <Masthead title={pageData.masthead} />

        <div className={styles.twoColumnContentSectionContainer}>
          {pageData.faq && (
            <div className={styles.contentContainer_right}>
              <div className={styles.innerContainer}>
                <h2>{pageData.headercontent}</h2>
                <div className={styles.contentBlock}>
                  <Accordion items={pageData.faq} />
                </div>
              </div>
            </div>
          )}
          {pageData.image && (
            <div className={styles.imageContainer_right}>
              <img
                className={styles.image}
                src={image.url}
                alt={image.alternativeText}
              />
            </div>
          )}
        </div>
      </div>
    )
  );
};
