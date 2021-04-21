
declare module "*.scss" {
  const content: string;
  export default classes;
}

// Define the type of imported SVG files, which Webpack's url-loader/file-loader
// will normally import as a string URL to the image or an embedded data: URL.
//
// https://webpack.js.org/guides/typescript/#importing-other-assets
declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpeg" {
  const content: string;
  export default content;
}

declare module "*.pdf" {
  const content: string;
  export default content;
}

declare module "*.ico" {
  const content: string;
  export default content;
}
