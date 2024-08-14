import BackgroundImage from "../assets/img/bg.png";
import SearchByAlgoliaImage from "../assets/img/search-by-algolia.png";
import Our415Logo from "../assets/img/Our415_logo-hori.svg";
import SFSeal from "../assets/img/sf-seal.png";
import LinkSFLogo from "../assets/img/link-sf.png";
import config from "../config";
import styles from "../components/ui/Navigation/Navigation.module.scss";

// Include new white label here
type WhiteLabelSiteKey =
  | "defaultWhiteLabel"
  | "SFServiceGuide"
  | "SFFamilies"
  | "LinkSF";
type homepageComponentEnums = "HomePage" | "UcsfHomePage";

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
  intercom: boolean;
  logoLinkDestination: string;
  navLogoStyle: string;
  refinementListLimit: number;
  showBanner: boolean;
  showBreakingNews: boolean;
  showClinicianAction: boolean;
  showHandoutsIcon: boolean;
  showHeaderQrCode: boolean;
  showMobileNav: boolean;
  showPrintResultsBtn: boolean;
  showReportCrisis: boolean;
  siteNavStyle: string;
  siteUrl: string;
  title: string;
  userWay: boolean;
}

// Include a domain in config.js
function determineWhiteLabelSite(): WhiteLabelSiteKey {
  const domain = window.location.host;
  const subdomain = domain.split(".")[0];
  const checkWhiteLabelSubdomain = (whiteLabelSubdomain: string) =>
    subdomain === whiteLabelSubdomain ||
    subdomain === `${whiteLabelSubdomain}-staging`;

  if (checkWhiteLabelSubdomain(config.SFFAMILIES_DOMAIN)) return "SFFamilies";
  if (checkWhiteLabelSubdomain(config.LINKSF_DOMAIN)) return "LinkSF";
  if (
    subdomain === String(config.MOHCD_DOMAIN) ||
    domain === `staging.${String(config.MOHCD_DOMAIN)}.org`
  )
    return "SFServiceGuide";
  // N.B. The qaone environment can be used to test various whitelabels as needed

  return "defaultWhiteLabel";
}

const configKey = determineWhiteLabelSite();

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
  intercom: false,
  logoLinkDestination: "/",
  navLogoStyle: styles.siteNav,
  refinementListLimit: 10,
  showPrintResultsBtn: true,
  showBanner: false,
  showBreakingNews: false,
  showClinicianAction: false,
  showHandoutsIcon: false,
  showHeaderQrCode: false,
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

/*
  Specify what is viewed in each white label.
  A '/' (which is a forward-slash) as a value for logoLinkDestination
  denotes that the link is internal to the application.
*/

const SFFamilies: WhiteLabelSite = {
  appImages: {
    ...appImageDefaults,
    logoLarge: Our415Logo,
    logoSmall: Our415Logo,
  },
  ...whiteLabelDefaults,
  enabledTranslations: ["en", "es", "tl", "zh-TW", "vi", "ar", "ru"],
  footerOptions: {
    showOnListingPages: true,
    showTitle: false,
    showLinks: false,
    showSFSeal: true,
  },
  logoLinkDestination: "https://www.our415.org/",
  navLogoStyle: styles.navLogoSFFamilies,
  showMobileNav: false,
  showPrintResultsBtn: false,
  siteNavStyle: styles.siteNavSFFamilies,
  siteUrl: "https://our415.sfserviceguide.org",
  title: "Our 415",
  userWay: true,
} as const;

const SFServiceGuide: WhiteLabelSite = {
  appImages: {
    ...appImageDefaults,
    logoLarge: Our415Logo,
    logoSmall: Our415Logo,
  },
  ...whiteLabelDefaults,
  intercom: true,
  siteUrl: "https://sfserviceguide.org",
  showBreakingNews: true,
  title: "Our415",
  showReportCrisis: true,
} as const;

const LinkSF: WhiteLabelSite = {
  appImages: {
    ...appImageDefaults,
    logoLarge: LinkSFLogo,
    logoSmall: LinkSFLogo,
  },
  ...whiteLabelDefaults,
  siteUrl: "https://linksf.sfserviceguide.org",
  showBreakingNews: true,
  title: "Link SF",
} as const;

const defaultWhiteLabel: WhiteLabelSite = {
  appImages: {
    ...appImageDefaults,
    logoLarge: Our415Logo,
    logoSmall: Our415Logo,
  },
  ...whiteLabelDefaults,
  intercom: true,
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
  SFFamilies,
  SFServiceGuide,
  LinkSF,
  defaultWhiteLabel,
} as const;

// Disallow changes at run time
Object.freeze(whiteLabel);
Object.freeze(whiteLabel[configKey]?.appImages);

export default whiteLabel[configKey];
