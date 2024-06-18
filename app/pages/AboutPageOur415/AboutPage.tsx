import React, { useEffect, useState } from "react";
import { client } from "../../sanity";
import { Masthead } from "../../components/ui/Masthead/Masthead";
import { EmailSignup } from "../../components/EmailSignup/Emailsignup";
import {
  TwoColumnContent,
  TwoColumnContentSection,
} from "../../components/ui/TwoColumnContentSection/TwoColumnContentSection";

interface PageState {
  pageInitialized: boolean;
  mastHead: string;
  twoColumnContentSections: TwoColumnContent[];
}

export const AboutPage = () => {
  const [pageData, setPageData] = useState<PageState>({
    pageInitialized: false,
    mastHead: "",
    twoColumnContentSections: [],
  });

  useEffect(() => {
    const fetchPageData = async () => {
      const fetchedPageData = await client.fetch(
        `*[_type == 'contentPageType' && name == 'About']{mastHead, twoColumnContentSections[]->}`
      );

      const { mastHead, twoColumnContentSections } = fetchedPageData[0];

      setPageData({
        mastHead,
        twoColumnContentSections,
        pageInitialized: true,
      });
    };

    fetchPageData();
  }, []);

  if (!pageData.pageInitialized) {
    return <>loading...</>;
  }

  return (
    <>
      <Masthead title={pageData.mastHead} />
      {pageData?.twoColumnContentSections?.map(
        (section: JSX.IntrinsicAttributes & TwoColumnContent) => {
          return <TwoColumnContentSection key={section.key} {...section} />;
        }
      )}
      <EmailSignup />
    </>
  );
};
