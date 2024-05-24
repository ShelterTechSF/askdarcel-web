// import whiteLabel from "../../utils/whitelabel";
// import { LinkSf } from "./AboutPageMarkup/LinkSf";
// import { SfServiceGuide } from "./AboutPageMarkup/SfServiceGuide";
import React, { useEffect } from "react";
import { client } from "../../sanity";

// Disable max line length rule, since this file is mostly just text-heavy HTML content.
/* eslint-disable max-len */
export const AboutPage = () => {
  useEffect(() => {
    const fetchEvents = async () => {
      const data = await client.fetch(`*[_type == 'event']`);
      console.log(data);
      debugger;
    };

    fetchEvents();
  }, []);

  return <>sup</>;
};
