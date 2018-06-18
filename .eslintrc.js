module.exports = {
  "extends": [
    "airbnb",
    "plugin:testcafe/recommended",
  ],
  "globals": {
    "CONFIG": true,
    "google": true,
    "describe": true,
    "it": true
  },
  "plugins": [
    "react",
    "jsx-a11y",
    "import",
    "testcafe",
  ],
  "env": {
    "browser": true,
  },
  "rules": {
    "camelcase": 0,
    "import/no-extraneous-dependencies": 0,
    "no-plusplus": 0,
    "no-prototype-builtins": 0,
    "no-underscore-dangle": 0,
    "no-unused-expressions": [2, { "allowTaggedTemplates": true }],
    "react/forbid-prop-types": 0,
    "react/jsx-filename-extension": 2,
    "react/no-string-refs": 0,
    "react/prefer-stateless-function": 0,
    "react/prop-types": 0,
  },
  "settings": {
    "import/resolver": "webpack",
  },
};
