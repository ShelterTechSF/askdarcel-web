/* eslint-disable no-unused-vars, no-console */
process.env.NODE_ENV = "test";

require("@babel/register");
require("@babel/polyfill");

console.clear();

require.extensions[".css"] = () => null;
require.extensions[".scss"] = () => null;

const { JSDOM } = require("jsdom");
const Enzyme = require("enzyme");
const Adapter = require("enzyme-adapter-react-16");

Enzyme.configure({ adapter: new Adapter() });

const exposedProperties = ["window", "navigator", "document"];

const jsdom = new JSDOM("", { url: "http://localhost" });
global.window = jsdom.window;
global.document = jsdom.window.document;
global.navigator = { userAgent: "node.js" };

Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === "undefined") {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

// const documentRef = document
