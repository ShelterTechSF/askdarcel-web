const { readFileSync, existsSync } = require("fs");
const yaml = require("js-yaml");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const webpack = require("webpack");
const CompressionPlugin = require("compression-webpack-plugin");
const zlib = require("zlib");

let userConfig = {};

if (existsSync("config.yml") || process.env.CONFIG_YAML) {
  const CONFIG_YAML = process.env.CONFIG_YAML || "config.yml";
  userConfig = yaml.safeLoad(readFileSync(CONFIG_YAML, "utf8"));
} else {
  // eslint-disable-next-line
  console.warn(
    "No configuration file detected, defaulting to environment variables."
  );
}

// Take the user config from the file, and override keys with environment variables if they exist
const environmentConfig = [
  "API_URL",
  "API_PROXY_SECURE",
  "API_PROXY_CHANGE_ORIGIN",
  "API_PROXY_REWRITE",
  "GOOGLE_API_KEY",
  "ALGOLIA_INDEX_PREFIX",
  "ALGOLIA_APPLICATION_ID",
  "ALGOLIA_READ_ONLY_API_KEY",
  "MOHCD_SUBDOMAIN",
  "MOHCD_DOMAIN",
  "SFFAMILIES_DOMAIN",
  "TESTCAFE_RUNNING",
  "LINKSF_DOMAIN",
  "AUTH0_AUDIENCE",
  "AUTH0_CLIENT_ID",
  "AUTH0_DOMAIN",
  "AUTH0_REDIRECT_URI",
  "STRAPI_API_TOKEN",
  "STRAPI_API_URL",
];

const config = environmentConfig.reduce((acc, key) => {
  if (process.env[key] !== undefined) {
    acc[key] = process.env[key];
  }
  return acc;
}, userConfig);

const appRoot = path.resolve(__dirname, "app/");
const buildDir = path.resolve(__dirname, "build");

module.exports = {
  mode: process.env.NODE_ENV || "production",
  context: __dirname,
  entry: ["whatwg-fetch", "@babel/polyfill", path.resolve(appRoot, "init.tsx")],
  output: {
    path: buildDir,
    publicPath: "/dist/",
    filename: "bundle.js",
    clean: true,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
    alias: {
      app: path.resolve(appRoot, ""),
      assets: path.resolve(appRoot, "assets"),
      actions: path.resolve(appRoot, "actions"),
      components: path.resolve(appRoot, "components"),
      models: path.resolve(appRoot, "models"),
      hooks: path.resolve(appRoot, "hooks"),
      pages: path.resolve(appRoot, "pages"),
      reducers: path.resolve(appRoot, "reducers"),
      styles: path.resolve(appRoot, "styles"),
      utils: path.resolve(appRoot, "utils"),
    },
  },
  plugins: [
    // TODO: Replace og fields:
    new HtmlWebpackPlugin({
      title: "Our415",
      template: "app/index.html",
      meta: {
        "og:url": "https://sfserviceguide.org", // TODO: Change This
        "og:title": "Our415 | San Francisco",
        "og:description":
          "Our 415 is your source for everything San Francisco has for young people and families.",
        "og:type": "website",
        // Note: The image is specified in the HTML itself because it needs to
        // reference an image file.
        "og:image:type": "image/png",
        "og:image:width": "1200",
        "og:image:height": "630",
      },
      favicon: "app/assets/img/our-415-favicon.png",
    }),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      CONFIG: JSON.stringify(config),
    }),
    new ForkTsCheckerWebpackPlugin(),
    new CopyPlugin({
      patterns: [{ from: "public", to: path.resolve(__dirname, "public") }],
    }),
    new NodePolyfillPlugin(),
    // This became necessary to add after upgrading dependencies. It was likely one of the deps in the webpack build
    // chain which caused the error:
    // `Uncaught ReferenceError: process is not defined` in AlogliaSearchCore.js
    // However this error didn't surface until a subsequent PR was merged, which might have forced a rebuild of the
    // dep tree/module cache.
    // See: https://stackoverflow.com/questions/41359504/webpack-bundle-js-uncaught-referenceerror-process-is-not-defined
    new webpack.ProvidePlugin({
      process: "process/browser.js",
    }),
    new CompressionPlugin({
      filename: "[path][base].gz",
      algorithm: "gzip",
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8,
      deleteOriginalAssets: false,
    }),
    new CompressionPlugin({
      filename: "[path][base].br",
      algorithm: "brotliCompress",
      test: /\.(js|css|html|svg)$/,
      compressionOptions: {
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
        },
      },
      threshold: 10240,
      minRatio: 0.8,
      deleteOriginalAssets: false,
    }),
  ],
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        use: [
          {
            loader: "babel-loader",
          },
        ],
        exclude: [/node_modules/],
      },
      {
        test: /\.s?css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: {
                auto: true,
                localIdentName: "[path][name]__[local]--[contenthash:base64:5]",
              },
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.(ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name][ext]",
        },
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "[name]-[contenthash][ext]",
        },
        use: [
          {
            loader: "image-webpack-loader",
            options: {
              gifsicle: {
                interlaced: false,
              },
              optipng: {
                optimizationLevel: 7,
              },
              disable: true,
            },
          },
        ],
      },
      {
        test: /\.pdf$/,
        type: "asset/resource",
        generator: {
          filename: "[name][ext]",
        },
        include: [path.resolve(__dirname, "app/assets")],
      },
    ],
  },
  devServer: {
    static: buildDir,
    historyApiFallback: true,
    proxy: [
      {
        context: ["/api-docs"],
        target: config.API_UR || "http://localhost:3000",
        secure: config.API_PROXY_SECURE || false,
        changeOrigin: config.API_PROXY_CHANGE_ORIGIN || false,
      },
      {
        context: ["/api/v2/"],
        target: config.API_URL || "http://localhost:3001",
        pathRewrite: config.API_PROXY_REWRITE
          ? { "^/api/v2/": "/api/" }
          : undefined,
        secure: config.API_PROXY_SECURE || false,
        changeOrigin: config.API_PROXY_CHANGE_ORIGIN || false,
      },
      {
        context: ["/api/"],
        target: config.API_URL || "http://localhost:3000",
        pathRewrite: config.API_PROXY_REWRITE ? { "^/api/": "" } : undefined,
        secure: config.API_PROXY_SECURE || false,
        changeOrigin: config.API_PROXY_CHANGE_ORIGIN || false,
      },
    ],
    client: {
      overlay: false,
    },
  },
};
