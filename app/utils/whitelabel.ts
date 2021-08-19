import AskDarcelImage from '../assets/img/askdarcel.svg';
import BackgroundImage from '../assets/img/bg.png';
import SearchByAlgoliaImage from '../assets/img/search-by-algolia.png';
import SFFamiliesLogo from '../assets/img/sf-families.svg';
import SFServiceLogo from '../assets/img/sf-service.svg';
import SFSeal from '../assets/img/sf-seal.png';
import config from '../config';

// Use url to get key of config object
// @ts-ignore
const configKey = Object.keys(config).find((key) => config[key] === window.location.host) || 'default';
let configurations: any;
configurations = {};

// Configure title
configurations.title = {
  SFFAMILIES_DOMAIN: 'SF Families',
  MOHCD_DOMAIN: 'SF Service Guide',
  default: 'AskDarcel',
};

// Configure site url
configurations.siteUrl = {
  SFFAMILIES_DOMAIN: 'https://sffamilies.sfserviceguide.org/',
  MOHCD_DOMAIN: 'https://sfserviceguide.org',
  default: 'https://askdarcel.org',
};

// @ts-ignore
const icons = require.context('../assets/img', true, /ic-.*\.(png|svg)$/i);
const iconPathMap = {};

// @ts-ignore
icons.keys().forEach((key) => { iconPathMap[key.match(/ic-([^@]*)(?:@3x)?.(?:svg|png)/)[1]] = icons(key); });

// @ts-ignore
const icon = (name) => iconPathMap[name.toLowerCase().replace(/(\s+|\/)/g, '-')];
declare const require: any;

// Configure images
configurations.appImages = {
  SFFAMILIES_DOMAIN: {
    background: BackgroundImage,
    logoLarge: SFFamiliesLogo,
    logoSmall: SFFamiliesLogo,
    algolia: SearchByAlgoliaImage,
    mohcdSeal: SFSeal,
    icon,
  },
  MOHCD_DOMAIN: {
    background: BackgroundImage,
    logoLarge: SFServiceLogo,
    logoSmall: SFServiceLogo,
    algolia: SearchByAlgoliaImage,
    mohcdSeal: SFSeal,
    icon,
  },
  default: {
    background: BackgroundImage,
    logoLarge: AskDarcelImage,
    logoSmall: AskDarcelImage,
    algolia: SearchByAlgoliaImage,
    mohcdSeal: SFSeal,
    icon,
  },
};

/** Whether we should display the SF Service Guide branded version of the site */
const isSFFamiliesSite = configKey === config.SFFAMILIES_DOMAIN;

export const whiteLabel = {
  title: configurations.title[configKey],
  siteUrl: configurations.siteUrl[configKey],
  appImages: configurations.appImages[configKey],
  isSFFamiliesSite,
};
