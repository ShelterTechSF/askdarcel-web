import whiteLabel from "../../utils/whitelabel";

import { LinkSfJsx } from "./AboutPageMarkup/LinkSf";
import { SfServiceGuideJsx } from "./AboutPageMarkup/SfServiceGuide";

// Disable max line length rule, since this file is mostly just text-heavy HTML content.
/* eslint-disable max-len */

export const AboutPage = () => {
  const { title } = whiteLabel;

  // Display different about page content depending on whether
  // web domain is a whitelabel or not
  // Todo: The different About page JSX components can be more DRY
  if (title === "Link SF") {
    return LinkSfJsx();
  }

  return SfServiceGuideJsx();
};
