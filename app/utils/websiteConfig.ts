import BackgroundImage from "../assets/img/bg.png";
import SearchByAlgoliaImage from "../assets/img/search-by-algolia.png";
import Our415Logo from "../assets/img/Our415_logo-hori.svg";
import SFSeal from "../assets/img/sf-seal.png";
import styles from "../components/ui/Navigation/Navigation.module.scss";

type homepageComponentEnums = "HomePage";

interface WebsiteConfigSite {
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
  intercom: boolean;
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
  userWay: boolean;
}

const configKey = "defaultWebsiteConfig";

const websiteConfigDefaults = {
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
  intercom: false,
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
  userWay: false,
} as const;

const appImageDefaults = {
  background: BackgroundImage,
  algolia: SearchByAlgoliaImage,
  mohcdSeal: SFSeal,
} as const;

const defaultWebsiteConfig: WebsiteConfigSite = {
  appImages: {
    ...appImageDefaults,
    logoLarge: Our415Logo,
    logoSmall: Our415Logo,
  },
  ...websiteConfigDefaults,
  intercom: true,
  siteUrl: "https://askdarcel.org",
  showBreakingNews: true,
  title: "Our415",
  showReportCrisis: true,
} as const;

/*
  websiteConfig made Readonly to force developer to modify websiteConfig object in this file.
  Disallow changes at compile time.
*/
const websiteConfig: Readonly<
  Record<"defaultWebsiteConfig", WebsiteConfigSite>
> = {
  defaultWebsiteConfig,
} as const;

// Disallow changes at run time
Object.freeze(websiteConfig);
Object.freeze(websiteConfig[configKey]?.appImages);

export default websiteConfig[configKey];
