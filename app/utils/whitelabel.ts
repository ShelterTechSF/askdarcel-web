import BackgroundImage from "../assets/img/bg.png";
import SearchByAlgoliaImage from "../assets/img/search-by-algolia.png";
import Our415Logo from "../assets/img/Our415_logo-hori.svg";
import SFServiceLogo from "../assets/img/sf-service.svg";
import UcsfServiceLogo from "../assets/img/ic-dcnav.png";
import SFSeal from "../assets/img/sf-seal.png";
import LinkSFLogo from "../assets/img/link-sf.png";
import config from "../config";
import styles from "../components/ui/Navigation.module.scss";

// Include new white label here
type WhiteLabelSiteKey =
  | "defaultWhiteLabel"
  | "SFServiceGuide"
  | "SFFamilies"
  | "LinkSF"
  | "Ucsf";
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
  homePageComponent: homepageComponentEnums;
  intercom: boolean;
  logoLinkDestination: string;
  navLogoStyle: string;
  refinementListLimit: number;
  showBanner: boolean;
  showClinicianAction: boolean;
  showHandoutsIcon: boolean;
  showHeaderQrCode: boolean;
  showMobileNav: boolean;
  showPrintResultsBtn: boolean;
  showSearch: boolean;
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
  if (checkWhiteLabelSubdomain(config.UCSF_DOMAIN)) return "Ucsf";
  if (
    subdomain === String(config.MOHCD_DOMAIN) ||
    domain === `staging.${String(config.MOHCD_DOMAIN)}.org`
  )
    return "SFServiceGuide";
  // N.B. The qaone environment can be used to test various whitelabels as needed
  if (subdomain === "qaone") return "Ucsf";

  return "defaultWhiteLabel";
}

const configKey = determineWhiteLabelSite();

const whiteLabelDefaults = {
  aboutPageText: `The SF Service Guide is an online directory of human services in San
Francisco. Our goal is to help anyone with access to a smartphone,
tablet, or computer find the services they need. The guide's
focus is on homelessness and housing services, but also covers a
variety of other services, from education and legal aid to senior
services and re-entry programs.`,
  aboutPageTitle: "SF Service Guide",
  enabledTranslations: ["en", "es", "tl", "zh-TW"],
  homePageComponent: "HomePage",
  intercom: false,
  logoLinkDestination: "/",
  navLogoStyle: styles.siteNav,
  refinementListLimit: 10,
  showPrintResultsBtn: true,
  showBanner: true,
  showClinicianAction: false,
  showHandoutsIcon: false,
  showHeaderQrCode: false,
  showMobileNav: true,
  showSearch: true,
  showReportCrisis: true,
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
  logoLinkDestination: "https://www.our415.org/",
  navLogoStyle: styles.navLogoSFFamilies,
  showBanner: false,
  showMobileNav: false,
  showPrintResultsBtn: false,
  showSearch: false,
  siteNavStyle: styles.siteNavSFFamilies,
  siteUrl: "https://our415.sfserviceguide.org/",
  title: "Our 415",
  userWay: true,
} as const;

const SFServiceGuide: WhiteLabelSite = {
  appImages: {
    ...appImageDefaults,
    logoLarge: SFServiceLogo,
    logoSmall: SFServiceLogo,
  },
  ...whiteLabelDefaults,
  intercom: true,
  siteUrl: "https://sfserviceguide.org",
  title: "SF Service Guide",
} as const;

const LinkSF: WhiteLabelSite = {
  appImages: {
    ...appImageDefaults,
    logoLarge: LinkSFLogo,
    logoSmall: LinkSFLogo,
  },
  ...whiteLabelDefaults,
  siteUrl: "https://linksf.sfserviceguide.org",
  title: "Link SF",
} as const;

const defaultWhiteLabel: WhiteLabelSite = {
  appImages: {
    ...appImageDefaults,
    logoLarge: SFServiceLogo,
    logoSmall: SFServiceLogo,
  },
  ...whiteLabelDefaults,
  intercom: true,
  siteUrl: "https://askdarcel.org",
  title: "AskDarcel",
} as const;

const Ucsf: WhiteLabelSite = {
  appImages: {
    ...appImageDefaults,
    logoLarge: UcsfServiceLogo,
    logoSmall: UcsfServiceLogo,
  },
  ...whiteLabelDefaults,
  aboutPageText: `The Discharge Navigator is a clinician-focused tool designed to empower medical providers
with real-time access to information about social resources around San Francisco. Clinicians
can utilize this database to identify and share targeted resources for patients based on social
needs, language requirements, and demographics. This project is the result of collaboration
among experts across the SF Department of Public Health, Zuckerberg SF General Emergency
Department, and UCSF School of Medicine in partnership with SF Service Guide.`,
  aboutPageTitle: "Discharge Navigator",
  enabledTranslations: [],
  homePageComponent: "UcsfHomePage",
  navLogoStyle: styles.navLogoUcsf,
  refinementListLimit: 15,
  showBanner: false,
  showClinicianAction: true,
  showHandoutsIcon: true,
  showHeaderQrCode: true,
  showPrintResultsBtn: false,
  siteUrl: "https://dcnav.sfserviceguide.org",
  title: "Discharge Navigator",
} as const;

/*
  whiteLabel made Readonly to force developer to modify whiteLabel object in this file.
  Disallow changes at compile time.
*/
const whiteLabel: Readonly<Record<WhiteLabelSiteKey, WhiteLabelSite>> = {
  SFFamilies,
  SFServiceGuide,
  LinkSF,
  Ucsf,
  defaultWhiteLabel,
} as const;

// Disallow changes at run time
Object.freeze(whiteLabel);
Object.freeze(whiteLabel[configKey]?.appImages);

export default whiteLabel[configKey];
