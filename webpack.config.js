const { readFileSync } = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtendedDefinePlugin = require('extended-define-webpack-plugin');

// Take the user config from the file, and override keys with environment variables if they exist
const userConfig = yaml.safeLoad(readFileSync('./config.yml', 'utf8'));
const environmentConfig = [
  'GOOGLE_API_KEY',
  'ALGOLIA_INDEX_PREFIX',
  'ALGOLIA_APPLICATION_ID',
  'ALGOLIA_READ_ONLY_API_KEY',
];

const config = environmentConfig.reduce((acc, key) => {
  if (process.env[key] !== undefined) { acc[key] = process.env[key]; }
  return acc;
}, userConfig);

const appRoot = path.resolve(__dirname, 'app/');
const buildDir = path.resolve(__dirname, 'build');

module.exports = {
  context: __dirname,
  entry: ['whatwg-fetch', 'babel-polyfill', path.resolve(appRoot, 'init.jsx')],
  output: {
    path: buildDir,
    publicPath: '/dist/',
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    alias: {
      assets: path.resolve(appRoot, 'assets'),
      actions: path.resolve(appRoot, 'actions'),
      components: path.resolve(appRoot, 'components'),
      reducers: path.resolve(appRoot, 'reducers'),
      styles: path.resolve(appRoot, 'styles'),
      utils: path.resolve(appRoot, 'utils'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Ask Darcel',
      template: 'app/index.html',
      favicon: 'app/favicon.ico',
    }),
    new ExtendedDefinePlugin({
      CONFIG: config,
    }),
  ],
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['es2015', 'react', 'stage-0'],
            },
          },
        ],
        exclude: [/node_modules/, /typings/],
      },
      {
        test: /\.s?css$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.yml$/,
        use: ['json-loader', 'yaml-loader'],
      },
      {
        test: /\.(ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]-[sha512:hash:hex:8].[ext]',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
              optimizationLevel: 7,
              interlaced: false,
            },
          },
        ],
      },
    ],
  },
  devServer: {
    contentBase: buildDir,
    historyApiFallback: true,
    devtool: 'source-map',
    colors: true,
    proxy: {
      '/api/*': {
        target: process.env.API_URL || 'http://localhost:3000',
        rewrite(req) {
          req.url = req.url.replace(/^\/api/, '');
        },
      },
    },
  },
};
