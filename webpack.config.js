const { readFileSync } = require("fs");
const yaml = require("js-yaml");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtendedDefinePlugin = require("extended-define-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

const CONFIG_YAML = process.env.CONFIG_YAML || "config.yml";

// Take the user config from the file, and override keys with environment variables if they exist
const userConfig = yaml.safeLoad(readFileSync(CONFIG_YAML, "utf8"));
const environmentConfig = [
  "GOOGLE_API_KEY",
  "ALGOLIA_INDEX_PREFIX",
  "ALGOLIA_APPLICATION_ID",
  "ALGOLIA_READ_ONLY_API_KEY",
  "MOHCD_SUBDOMAIN",
  "MOHCD_DOMAIN",
  "SFFAMILIES_DOMAIN",
  "TESTCAFE_RUNNING",
  "LINKSF_DOMAIN",
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
    filename: "bundle.[contenthash].js",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
    alias: {
      app: path.resolve(appRoot, ""),
      assets: path.resolve(appRoot, "assets"),
      actions: path.resolve(appRoot, "actions"),
      components: path.resolve(appRoot, "components"),
      models: path.resolve(appRoot, "models"),
      pages: path.resolve(appRoot, "pages"),
      reducers: path.resolve(appRoot, "reducers"),
      styles: path.resolve(appRoot, "styles"),
      utils: path.resolve(appRoot, "utils"),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "SF Service Guide",
      template: "app/index.html",
      meta: {
        "og:url": "https://sfserviceguide.org",
        "og:title": "SF Service Guide | San Francisco",
        "twitter:card": "summary_large_image",
        "twitter:site": "@sheltertechorg",
        "og:description":
          "Get guided help finding food, housing, rental assistance, hygiene, health resources, essential services, and more in San Francisco. See the latest updates during the COVID-19 Coronavirus pandemic.",
        "og:type": "website",
        // Note: The image is specified in the HTML itself because it needs to
        // reference an image file.
        "og:image:type": "image/png",
        "og:image:width": "1200",
        "og:image:height": "630",
      },
      favicon: "app/favicon.ico",
    }),
    new ExtendedDefinePlugin({
      CONFIG: config,
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    }),
    new ForkTsCheckerWebpackPlugin(),
    new CopyPlugin({
      patterns: [{ from: "public", to: path.resolve(__dirname, "public") }],
    }),
    new NodePolyfillPlugin(),
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
        exclude: [/sf-service-email\.png$/],
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
        test: /sf-service-email\.png$/,
        type: "asset/resource",
        generator: {
          // Do not include content hash so that this has a stable URL
          // accessible from email templates.
          filename: "[name][ext]",
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
    contentBase: buildDir,
    historyApiFallback: true,
    proxy: {
      "/api-docs": {
        target: process.env.API_URL || "http://localhost:3000",
      },
      "/api/v2/": {
        target: process.env.API_GO_URL || "http://localhost:3001",
        pathRewrite: { "^/api/v2/": "/api/" },
      },
      "/api/": {
        target: process.env.API_URL || "http://localhost:3000",
        pathRewrite: { "^/api/": "" },
      },
    },
  },
};
