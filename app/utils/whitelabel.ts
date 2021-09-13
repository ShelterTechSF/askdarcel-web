import AskDarcelImage from '../assets/img/askdarcel.svg';
import BackgroundImage from '../assets/img/bg.png';
import SearchByAlgoliaImage from '../assets/img/search-by-algolia.png';
import SFFamiliesLogo from '../assets/img/sf-families.svg';
import SFServiceLogo from '../assets/img/sf-service.svg';
import SFSeal from '../assets/img/sf-seal.png';
import config from '../config';
import styles from '../components/ui/Navigation/Navigation.module.scss';

// Include new white label here
type WhiteLabelSiteKey = 'defaultWhiteLabel' | 'SFServiceGuide' | 'SFFamilies';

/*
  Specify what is viewed in each white label.
  A '/' (which is a forward-slash) as a value for logoLinkDestination
  denotes that the link is internal to the application.
*/
interface WhiteLabelSite {
  appImages: {
    background: string;
    logoLarge: string;
    logoSmall: string;
    algolia: string;
    mohcdSeal: string;
  };
  intercomAppID?: string | null;
  logoLinkDestination: string;
  navLogoStyle: string;
  showBanner: boolean;
  showMobileNav: boolean;
  showSearch: boolean;
  siteNavStyle: string;
  siteUrl: string;
  title: string;
  userWayAppID?: string | null;
}

// Include a domain in config.js
function determineWhiteLabelSite(): WhiteLabelSiteKey {
  if (window.location.host === config.SFFAMILIES_DOMAIN) return 'SFFamilies';
  if (window.location.host === config.MOHCD_DOMAIN) return 'SFServiceGuide';
  return 'defaultWhiteLabel';
}

const configKey = determineWhiteLabelSite();

const SFFamilies: WhiteLabelSite = {
  appImages: {
    background: BackgroundImage,
    logoLarge: SFFamiliesLogo,
    logoSmall: SFFamiliesLogo,
    algolia: SearchByAlgoliaImage,
    mohcdSeal: SFSeal,
  },
  intercomAppID: config?.INTERCOM_APP_ID ? config?.INTERCOM_APP_ID : null,
  logoLinkDestination: 'https://www.sffamilies.org/',
  navLogoStyle: styles.navLogoSFFamilies,
  showBanner: false,
  showMobileNav: false,
  showSearch: false,
  siteNavStyle: styles.siteNavSFFamilies,
  siteUrl: 'https://sffamilies.sfserviceguide.org/',
  title: 'SF Families',
  userWayAppID: config?.SFFAMILIES_USERWAY_APP_ID ? config?.SFFAMILIES_USERWAY_APP_ID : null,
} as const;

const SFServiceGuide: WhiteLabelSite = {
  appImages: {
    background: BackgroundImage,
    logoLarge: SFServiceLogo,
    logoSmall: SFServiceLogo,
    algolia: SearchByAlgoliaImage,
    mohcdSeal: SFSeal,
  },
  intercomAppID: config?.INTERCOM_APP_ID ? config?.INTERCOM_APP_ID : null,
  logoLinkDestination: '/',
  navLogoStyle: styles.siteNav,
  showBanner: true,
  showMobileNav: true,
  showSearch: true,
  siteNavStyle: styles.navLogo,
  siteUrl: 'https://sfserviceguide.org',
  title: 'SF Service Guide',
  userWayAppID: config?.SFFAMILIES_USERWAY_APP_ID ? config?.SFFAMILIES_USERWAY_APP_ID : null,
} as const;

const defaultWhiteLabel: WhiteLabelSite = {
  appImages: {
    background: BackgroundImage,
    logoLarge: AskDarcelImage,
    logoSmall: AskDarcelImage,
    algolia: SearchByAlgoliaImage,
    mohcdSeal: SFSeal,
  },
  intercomAppID: config?.INTERCOM_APP_ID ? config?.INTERCOM_APP_ID : null,
  logoLinkDestination: '/',
  navLogoStyle: styles.siteNav,
  showBanner: true,
  showMobileNav: true,
  showSearch: true,
  siteNavStyle: styles.navLogo,
  siteUrl: 'https://askdarcel.org',
  title: 'AskDarcel',
  userWayAppID: config?.SFFAMILIES_USERWAY_APP_ID ? config?.SFFAMILIES_USERWAY_APP_ID : null,
} as const;

const whiteLabel: Readonly<Record<WhiteLabelSiteKey, WhiteLabelSite>> = {
  SFFamilies,
  SFServiceGuide,
  defaultWhiteLabel,
} as const;

Object.freeze(whiteLabel);
Object.freeze(whiteLabel[configKey].appImages);

export default whiteLabel[configKey];
