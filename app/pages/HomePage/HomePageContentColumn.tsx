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
    const fetchContentData = async () => {
      const fetchedContentData = await client.fetch(
        `*[_type == 'contentPageType' && name == 'Home']{twoColumnContentSections[]->}`
      );

      const { twoColumnContentSections } = fetchedContentData[0];

      setContentData({
        twoColumnContentSections,
        contentInitialized: true,
      });
    };

    fetchContentData();
  }, []);

  if (!contentData.contentInitialized) {
    return <>loading...</>;
  }

  return (
    <TwoColumnContentSection {...contentData.twoColumnContentSections[0]} />
  );
};
