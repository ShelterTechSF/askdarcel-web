import React, { useEffect, useState } from "react";
import { client } from "../../sanity";
import { Masthead } from "../../components/ui/Masthead/Masthead";
import { EmailSignup } from "../../components/EmailSignup/Emailsignup";
import { TwoColumnContentSection } from "../../components/ui/TwoColumnContentSection/TwoColumnContentSection";

export const AboutPage = () => {
  const [pageData, setPageData] = useState({ pageInitialized: false });

  useEffect(() => {
    const fetchPageData = async () => {
      const fetchedPageData = await client.fetch(
        `*[_type == 'contentPage' && name == 'About']{mastHead, twoColumnContentSections[]->}`
      );

      setPageData({
        ...fetchedPageData[0],
        pageInitialized: true,
      });
    };

    fetchPageData();
  }, []);

  if (!pageData.pageInitialized) {
    return <>"loading...";</>;
  }

  return (
    <>
      <Masthead title={pageData.mastHead} />
      {pageData?.twoColumnContentSections?.map((section: any) => {
        console.log(section.contentBlock);
        return (
          <TwoColumnContentSection
            title={section.name}
            contentBlock={section.contentBlock}
          />
        );
      })}
      <EmailSignup />
    </>
  );
};
