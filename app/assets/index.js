var icons = require.context("../assets/img", true, /ic-.*\.png$/i);
var iconPathMap = {};
icons.keys().forEach(function (key) {
  iconPathMap[key.match(/ic-([^@]*)(?:@3x)?.png/)[1]] = icons(key);
});

function icon(name) {
  return iconPathMap[name.toLowerCase()];
}

export const images = {
  background: require('../assets/img/bg.png'),
  logoLarge: require('../assets/img/askdarcel-logo.png'),
  logoSmall: require('../assets/img/logo-small-white@3x.png'),
  icon: icon
};
