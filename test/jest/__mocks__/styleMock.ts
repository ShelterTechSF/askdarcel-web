// Webpack is not available in tests to handle the css import parsing and handling. Our test config tells jest to
// replace any style imports it sees with this empty object.
export default class StyleMock {}
