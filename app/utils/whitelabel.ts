import AskDarcelImage from '../assets/img/askdarcel.svg';
import BackgroundImage from '../assets/img/bg.png';
import SearchByAlgoliaImage from '../assets/img/search-by-algolia.png';
import SFFamiliesLogo from '../assets/img/sf-families.svg';
import SFServiceLogo from '../assets/img/sf-service.svg';
import SFSeal from '../assets/img/sf-seal.png';
import LinkSFLogo from '../assets/img/link-sf.png';
import config from '../config';
import styles from '../components/ui/Navigation/Navigation.module.scss';

// Include new white label here
type WhitelabelSiteKey = 'defaultWhitelabel' | 'SFServiceGuide' | 'SFFamilies' | 'LinkSF';

/*
  Specify what is viewed in each white label.
  A '/' (which is a forward-slash) as a value for logoLinkDestination
  denotes that the link is internal to the application.
*/
interface WhitelabelSite {
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
function determineWhitelabelSite(): WhitelabelSiteKey {
  const subdomain = window.location.host.split('.')[0];
  if (subdomain === String(config.SFFAMILIES_DOMAIN) || subdomain === `${String(config.SFFAMILIES_DOMAIN)}-staging`) return 'SFFamilies';
  if (subdomain === String(config.MOHCD_DOMAIN) || subdomain === `${String(config.MOHCD_DOMAIN)}-staging`) return 'SFServiceGuide';
  if (subdomain === String(config.LINKSF_DOMAIN) || subdomain === `${String(config.LINKSF_DOMAIN)}-staging`) return 'LinkSF';
  return 'defaultWhitelabel';
}

const configKey = determineWhitelabelSite();

const SFFamilies: WhitelabelSite = {
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

const SFServiceGuide: WhitelabelSite = {
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

const LinkSF: WhitelabelSite = {
  appImages: {
    background: BackgroundImage,
    logoLarge: LinkSFLogo,
    logoSmall: LinkSFLogo,
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
  siteUrl: 'https://linksf.sfserviceguide.org',
  title: 'Link SF',
  userWayAppID: null,
} as const;


const defaultWhitelabel: WhitelabelSite = {
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

const whitelabel: Readonly<Record<WhitelabelSiteKey, WhitelabelSite>> = {
  SFFamilies,
  SFServiceGuide,
  LinkSF,
  defaultWhitelabel,
} as const;

Object.freeze(whitelabel);
Object.freeze(whitelabel[configKey].appImages);

export default whitelabel[configKey];
