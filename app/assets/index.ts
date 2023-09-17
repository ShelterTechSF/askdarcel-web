const icons = require.context("../assets/img", true, /ic-.*\.(png|svg)$/i);
const iconPathMap: Record<string, string> = {};

icons.keys().forEach((key) => {
  iconPathMap[key.match(/ic-([^@]*)(?:@3x)?.(?:svg|png)/)![1]] = icons(key);
});

const icon = (name: string): string =>
  iconPathMap[name.toLowerCase().replace(/(\s+|\/)/g, "-")];

export { icon };
