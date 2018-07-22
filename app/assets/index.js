const icons = require.context('../assets/img', true, /ic-.*\.(png|svg)$/i);
const iconPathMap = {};
icons.keys().forEach((key) => {
  iconPathMap[key.match(/ic-([^@]*)(?:@3x)?.(?:svg|png)/)[1]] = icons(key);
});

function icon(name) {
  return iconPathMap[name.toLowerCase().replace(/(\s+|\/)/g, '-')];
}

const subDomain = window.location.host.split('.')[0];

let appImages = {};
/* eslint-disable no-undef */
if (subDomain === CONFIG.MOHCD_SUBDOMAIN) {
/* eslint-enable no-undef */
    /* eslint-disable global-require */
  appImages = {
    background: require('../assets/img/bg.png'),
    logoLarge: require('../assets/img/help-sfgov.svg'),
    logoSmall: require('../assets/img/help-sfgov.svg'),
    algolia: require('../assets/img/search-by-algolia.png'),
    mohcdSeal: require('../assets/img/sf-seal.png'),
    icon,
  };
} else {
  appImages = {
    background: require('../assets/img/bg.png'),
    logoLarge: require('../assets/img/askdarcel-logo.png'),
    logoSmall: require('../assets/img/logo-small-white@3x.png'),
    algolia: require('../assets/img/search-by-algolia.png'),
    mohcdSeal: require('../assets/img/sf-seal.png'),
    icon,
  };
  /* eslint-enable global-require */
}

const images = appImages;

export { images, images as default };
