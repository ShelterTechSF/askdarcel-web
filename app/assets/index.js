const icons = require.context('../assets/img', true, /ic-.*\.(png|svg)$/i);
const iconPathMap = {};

icons.keys().forEach(key => { iconPathMap[key.match(/ic-([^@]*)(?:@3x)?.(?:svg|png)/)[1]] = icons(key); });

const icon = name => iconPathMap[name.toLowerCase().replace(/(\s+|\/)/g, '-')];

export { icon };
