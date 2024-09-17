import BackgroundImage from "../assets/img/bg.png";
import SearchByAlgoliaImage from "../assets/img/search-by-algolia.png";
import Our415Logo from "../assets/img/Our415_logo-hori.svg";
import SFSeal from "../assets/img/sf-seal.png";
import styles from "../components/ui/Navigation/Navigation.module.scss";

// Include new white label here
type WhiteLabelSiteKey = "defaultWhiteLabel";
type homepageComponentEnums = "HomePage";

interface WhiteLabelSite {
  aboutPageText: string;
  aboutPageTitle: string;
  appImages: {
    background: string;
    logoLarge: string;
    logoSmall: string;
    algolia: string;
    mohcdSeal: string;
  };
  /** A list of languages to enable automatic translations for.
   *
   * The language codes must match the Google Translate API [1].
   * Set to the empty array to disable automatic translation.
   *
   * [1]: https://cloud.google.com/translate/docs/languages
   */
  enabledTranslations: readonly string[];
  footerOptions: {
    showOnListingPages: boolean;
    showTitle: boolean;
    showLinks: boolean;
    showSFSeal: boolean;
  };
  homePageComponent: homepageComponentEnums;
  logoLinkDestination: string;
  navLogoStyle: string;
  refinementListLimit: number;
  showBanner: boolean;
  showBreakingNews: boolean;
  showClinicianAction: boolean;
  showMobileNav: boolean;
  showPrintResultsBtn: boolean;
  showReportCrisis: boolean;
  siteNavStyle: string;
  siteUrl: string;
  title: string;
}

const whiteLabelDefaults = {
  aboutPageText: `Our415 is an online directory of human services in San
Francisco. Our goal is to help anyone with access to a smartphone,
tablet, or computer find the services they need. The guide's
focus is on homelessness and housing services, but also covers a
variety of other services, from education and legal aid to senior
services and re-entry programs.`,
  aboutPageTitle: "Our415",
  enabledTranslations: ["en", "es", "tl", "zh-TW"],
  footerOptions: {
    showOnListingPages: false,
    showTitle: true,
    showLinks: true,
    showSFSeal: false,
  },
  homePageComponent: "HomePage",
  logoLinkDestination: "/",
  navLogoStyle: styles.siteNav,
  refinementListLimit: 10,
  showPrintResultsBtn: true,
  showBanner: false,
  showBreakingNews: false,
  showClinicianAction: false,
  showMobileNav: true,
  showReportCrisis: false,
  siteNavStyle: styles.siteNav,
} as const;

const appImageDefaults = {
  background: BackgroundImage,
  algolia: SearchByAlgoliaImage,
  mohcdSeal: SFSeal,
} as const;

const defaultWhiteLabel: WhiteLabelSite = {
  appImages: {
    ...appImageDefaults,
    logoLarge: Our415Logo,
    logoSmall: Our415Logo,
  },
  ...whiteLabelDefaults,
  siteUrl: "https://askdarcel.org",
  showBreakingNews: true,
  title: "Our415",
  showReportCrisis: true,
} as const;

/*
  whiteLabel made Readonly to force developer to modify whiteLabel object in this file.
  Disallow changes at compile time.
*/
const whiteLabel: Readonly<Record<WhiteLabelSiteKey, WhiteLabelSite>> = {
  defaultWhiteLabel,
} as const;

// Disallow changes at run time
Object.freeze(whiteLabel);
Object.freeze(whiteLabel["defaultWhiteLabel"]?.appImages);

export default whiteLabel["defaultWhiteLabel"];
