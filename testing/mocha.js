/* eslint-disable node/no-deprecated-api, no-unused-vars, no-console */
process.env.NODE_ENV = 'test';

require('babel-register')();
require('babel-polyfill');

console.clear();

require.extensions['.css'] = () => null;
require.extensions['.scss'] = () => null;

const { jsdom } = require('jsdom');
const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-15');

Enzyme.configure({ adapter: new Adapter() });

const exposedProperties = ['window', 'navigator', 'document'];

global.document = jsdom('');
global.navigator = { userAgent: 'node.js' };
global.window = document.defaultView;

Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

// const documentRef = document
