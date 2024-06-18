import React, { useEffect, useState } from "react";
import {
  TwoColumnContent,
  TwoColumnContentSection,
} from "components/ui/TwoColumnContentSection/TwoColumnContentSection";
import { client } from "../../sanity";

interface ContentState {
  contentInitialized: boolean;
  twoColumnContentSections: TwoColumnContent[];
}

export const HomePageContentColumn = () => {
  const [contentData, setContentData] = useState<ContentState>({
    contentInitialized: false,
    twoColumnContentSections: [],
  });

  useEffect(() => {
    const fetchPageData = async () => {
      const fetchedPageData = await client.fetch(
        `*[_type == 'contentPageType' && name == 'Home']{twoColumnContentSections[]->}`
      );

      const { twoColumnContentSections } = fetchedPageData[0];

      setContentData({
        twoColumnContentSections,
        contentInitialized: true,
      });
    };

    fetchPageData();
  }, []);

  if (!contentData.contentInitialized) {
    return <>loading...</>;
  }

  return (
    <TwoColumnContentSection {...contentData.twoColumnContentSections[0]} />
  );
};
