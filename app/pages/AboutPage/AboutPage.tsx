import React from "react";
import { Loader } from "components/ui/Loader";
import { usePageContent } from "hooks/StrapiAPI";
import { Masthead } from "../../components/ui/Masthead/Masthead";
import { TwoColumnContentSection } from "../../components/ui/TwoColumnContentSection/TwoColumnContentSection";
import { PageContent, StrapiDatum } from "models/Strapi";

export const AboutPage = () => {
  const { data, isLoading } = usePageContent("About");

  const res = data as Array<StrapiDatum<PageContent>>;

  const pageData = res?.length ? res[0].attributes : null;

  if (isLoading) {
    return <Loader />;
  }

  return (
    pageData && (
      <>
        <Masthead title={pageData.masthead} />
        {pageData.two_column_content_blocks?.data?.map((content) => (
          <TwoColumnContentSection key={content.id} {...content.attributes} />
        ))}
      </>
    )
  );
};
