import { isSFServiceGuideSite, isSFFamiliesSite } from '../utils/whitelabel';

const icons = require.context('../assets/img', true, /ic-.*\.(png|svg)$/i);
const iconPathMap = {};
icons.keys().forEach(key => {
  iconPathMap[key.match(/ic-([^@]*)(?:@3x)?.(?:svg|png)/)[1]] = icons(key);
});

function icon(name) {
  return iconPathMap[name.toLowerCase().replace(/(\s+|\/)/g, '-')];
}

let appImages = {};
if (isSFServiceGuideSite()) {
/* eslint-enable no-undef */
  /* eslint-disable global-require */
  appImages = {
    background: require('../assets/img/bg.png'),
    logoLarge: require('../assets/img/sf-service.svg'),
    logoSmall: require('../assets/img/sf-service.svg'),
    algolia: require('../assets/img/search-by-algolia.png'),
    mohcdSeal: require('../assets/img/sf-seal.png'),
    icon,
  };
} else if(isSFFamiliesSite()) {
  appImages = {
    background: require('../assets/img/bg.png'),
    logoLarge: require('../assets/img/sf-families.svg'),
    logoSmall: require('../assets/img/sf-families.svg'),
    algolia: require('../assets/img/search-by-algolia.png'),
    mohcdSeal: require('../assets/img/sf-seal.png'),
    icon,
  };
} else {
  appImages = {
    background: require('../assets/img/bg.png'),
    logoLarge: require('../assets/img/askdarcel.svg'),
    logoSmall: require('../assets/img/askdarcel.svg'),
    algolia: require('../assets/img/search-by-algolia.png'),
    mohcdSeal: require('../assets/img/sf-seal.png'),
    icon,
  };
  /* eslint-enable global-require */
}

const images = appImages;

export { images };
