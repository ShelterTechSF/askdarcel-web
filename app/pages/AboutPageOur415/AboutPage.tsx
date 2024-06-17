import React, { useEffect, useState } from "react";
import { SanityImageSource } from "@sanity/image-url/lib/types/types.d";
import { client } from "../../sanity";
import { Masthead } from "../../components/ui/Masthead/Masthead";
import { EmailSignup } from "../../components/EmailSignup/Emailsignup";
import { TwoColumnContentSection } from "../../components/ui/TwoColumnContentSection/TwoColumnContentSection";

interface TwoColumnContentSection {
  mediaAlignment: string;
  image: SanityImageSource;
  imageAlt: string | undefined;
  contentBlock: any;
  contentLinkButtonText: string;
  contentLinkButtonUrl: string;
  _id: string;
}

interface PageState {
  pageInitialized: boolean;
  mastHead: string;
  twoColumnContentSections: TwoColumnContentSection[];
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
        (section: JSX.IntrinsicAttributes & TwoColumnContentSection) => {
          return <TwoColumnContentSection key={section._id} {...section} />;
        }
      )}
      <EmailSignup />
    </>
  );
};
