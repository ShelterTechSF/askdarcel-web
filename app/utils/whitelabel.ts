import BackgroundImage from '../assets/img/bg.png';
import SearchByAlgoliaImage from '../assets/img/search-by-algolia.png';
import SFFamiliesLogo from '../assets/img/sf-families.svg';
import SFServiceLogo from '../assets/img/sf-service.svg';
import UcsfServiceLogo from '../assets/img/ucsf-logo.svg';
import SFSeal from '../assets/img/sf-seal.png';
import LinkSFLogo from '../assets/img/link-sf.png';
import config from '../config';
import styles from '../components/ui/Navigation.module.scss';

// Include new white label here
type WhiteLabelSiteKey = 'defaultWhiteLabel' | 'SFServiceGuide' | 'SFFamilies' | 'LinkSF' | 'Ucsf';
type homepageComponentEnums = 'HomePage' | 'UcsfHomePage';

interface WhiteLabelSite {
  appImages: {
    background: string;
    logoLarge: string;
    logoSmall: string;
    algolia: string;
    mohcdSeal: string;
  };
  enableTranslation: boolean;
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
  siteNavStyle: string;
  siteUrl: string;
  title: string;
  userWay: boolean;
}

// Include a domain in config.js
function determineWhiteLabelSite(): WhiteLabelSiteKey {
  const domain = window.location.host;
  const subdomain = domain.split('.')[0];
  const checkWhiteLabelSubdomain = (whiteLabelSubdomain: string) => (
    subdomain === whiteLabelSubdomain || subdomain === `${whiteLabelSubdomain}-staging`
  );

  if (checkWhiteLabelSubdomain(config.SFFAMILIES_DOMAIN)) return 'SFFamilies';
  if (checkWhiteLabelSubdomain(config.LINKSF_DOMAIN)) return 'LinkSF';
  if (checkWhiteLabelSubdomain(config.UCSF_DOMAIN)) return 'Ucsf';
  if (subdomain === String(config.MOHCD_DOMAIN) || domain === `staging.${String(config.MOHCD_DOMAIN)}.org`) return 'SFServiceGuide';
  // N.B. The qaone environment can be used to test various whitelabels as needed
  if (subdomain === 'qaone') return 'Ucsf';

  return 'defaultWhiteLabel';
}

const configKey = determineWhiteLabelSite();

const whiteLabelDefaults = {
  enableTranslation: true,
  homePageComponent: 'HomePage',
  intercom: false,
  logoLinkDestination: '/',
  navLogoStyle: styles.siteNav,
  refinementListLimit: 10,
  showPrintResultsBtn: true,
  showBanner: true,
  showClinicianAction: false,
  showHandoutsIcon: false,
  showHeaderQrCode: false,
  showMobileNav: true,
  showSearch: true,
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
    logoLarge: SFFamiliesLogo,
    logoSmall: SFFamiliesLogo,
  },
  ...whiteLabelDefaults,
  enableTranslation: true,
  logoLinkDestination: 'https://www.sffamilies.org/',
  navLogoStyle: styles.navLogoSFFamilies,
  showBanner: false,
  showMobileNav: false,
  showPrintResultsBtn: false,
  showSearch: false,
  siteNavStyle: styles.siteNavSFFamilies,
  siteUrl: 'https://sffamilies.sfserviceguide.org/',
  title: 'SF Families',
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
  siteUrl: 'https://sfserviceguide.org',
  title: 'SF Service Guide',
} as const;

const LinkSF: WhiteLabelSite = {
  appImages: {
    ...appImageDefaults,
    logoLarge: LinkSFLogo,
    logoSmall: LinkSFLogo,
  },
  ...whiteLabelDefaults,
  siteUrl: 'https://linksf.sfserviceguide.org',
  title: 'Link SF',
} as const;

const defaultWhiteLabel: WhiteLabelSite = {
  appImages: {
    ...appImageDefaults,
    logoLarge: SFServiceLogo,
    logoSmall: SFServiceLogo,
  },
  ...whiteLabelDefaults,
  intercom: true,
  siteUrl: 'https://askdarcel.org',
  title: 'AskDarcel',
} as const;

const Ucsf: WhiteLabelSite = {
  appImages: {
    ...appImageDefaults,
    logoLarge: UcsfServiceLogo,
    logoSmall: UcsfServiceLogo,
  },
  ...whiteLabelDefaults,
  enableTranslation: false,
  homePageComponent: 'UcsfHomePage',
  refinementListLimit: 15,
  showBanner: false,
  showClinicianAction: true,
  showHandoutsIcon: true,
  showHeaderQrCode: true,
  showPrintResultsBtn: false,
  siteUrl: 'https://ucsf.sfserviceguide.org', // todo: get the desired siteUrl from UCSF
  title: 'UCSF Outpatient Services',
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
