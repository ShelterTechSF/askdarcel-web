import AskDarcelImage from '../assets/img/askdarcel.svg';
import BackgroundImage from '../assets/img/bg.png';
import SearchByAlgoliaImage from '../assets/img/search-by-algolia.png';
import SFFamiliesLogo from '../assets/img/sf-families.svg';
import SFServiceLogo from '../assets/img/sf-service.svg';
import SFSeal from '../assets/img/sf-seal.png';
import config from '../config';
import icon from '../assets'

// Include new white label here
type WhiteLabelSiteKey = "default" | "SFServiceGuide" | "SFFamilies";

interface WhiteLabelSite {
  title: string;
  siteUrl: string;
  appImages: { 
    background: string,
     // For appImages, logoLarge and logoSmall are usually different between each white label
    logoLarge: string,
    logoSmall: string,
    algolia: string,
    mohcdSeal: string, 
    icon: (arg0: string) => ({Object: string})
  };
}

// Read only to force developer to modify configurations here, disallow changes at compile time
const configurations: Partial<Record<Readonly<WhiteLabelSiteKey>, Readonly<WhiteLabelSite>>> = {}; 

// Include a domain in config.js
function determineWhiteLabelSite(): WhiteLabelSiteKey {
  if (config.SFFAMILIES_DOMAIN === window.location.host) return "SFFamilies";
  if (config.MOHCD_DOMAIN === window.location.host) return "SFServiceGuide";
  return "default";
}

const configKey = determineWhiteLabelSite();

// Specify what is viewed in each white label
configurations.SFFamilies = {
  title: 'SF Families',
  siteUrl: 'https://sffamilies.sfserviceguide.org/',
  appImages: {     
    background: BackgroundImage, 
    logoLarge: SFFamiliesLogo,
    logoSmall: SFFamiliesLogo,
    algolia: SearchByAlgoliaImage,
    mohcdSeal: SFSeal,
    icon
  }
}

configurations.SFServiceGuide = {
  title: 'SF Service Guide',
  siteUrl: 'https://sfserviceguide.org',
  appImages: {     
    background: BackgroundImage,
    logoLarge: SFServiceLogo,
    logoSmall: SFServiceLogo,
    algolia: SearchByAlgoliaImage,
    mohcdSeal: SFSeal,
    icon
  }
}

configurations.default = {
  title: 'AskDarcel',
  siteUrl: 'https://askdarcel.org',
  appImages: {     
    background: BackgroundImage,
    logoLarge: AskDarcelImage,
    logoSmall: AskDarcelImage,
    algolia: SearchByAlgoliaImage,
    mohcdSeal: SFSeal,
    icon
  }
}

// Disallow changes at run time
Object.freeze(configurations);
Object.freeze(configurations[configKey]?.appImages);

export default configurations[configKey]
