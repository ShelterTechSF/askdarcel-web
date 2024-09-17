import React from "react";
import { Loader } from "components/ui";
import { usePageContent } from "hooks/StrapiAPI";
import { Masthead } from "../../components/ui/Masthead/Masthead";
import { EmailSignup } from "../../components/EmailSignup/Emailsignup";
import { TwoColumnContentSection } from "../../components/ui/TwoColumnContentSection/TwoColumnContentSection";
import { PageContent, StrapiDatum } from "models/Strapi";

export const FaqPage = () => {
  const { data, isLoading } = usePageContent("FAQ");

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
        <EmailSignup />
      </>
    )
  );
};
