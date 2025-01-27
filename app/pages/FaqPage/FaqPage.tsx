import React from "react";
import { Loader } from "components/ui/Loader";
import { useFaqPageData } from "hooks/StrapiAPI";
import { Masthead } from "../../components/ui/Masthead/Masthead";
import { FaqPageContent, StrapiDatum } from "models/Strapi";
import Accordion from "components/ui/Accordions/Accordion";

export const FaqPage = () => {
  const { data, isLoading } = useFaqPageData();

  const res = data as StrapiDatum<FaqPageContent>;

  const pageData = res?.attributes || null;

  if (isLoading) {
    return <Loader />;
  }

  return (
    pageData && (
      <>
        <Masthead title={pageData.masthead} />
        {pageData.faq && <Accordion items={pageData.faq} />}
      </>
    )
  );
};
