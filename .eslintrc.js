module.exports = {
  "extends": [
    "airbnb",
    "plugin:testcafe/recommended",
  ],
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
    "no-unused-expressions": [
      "error",
      {
        "allowTaggedTemplates": true,
      }
    ],
    "no-underscore-dangle": 0,
    "react/jsx-filename-extension": 0,
    "react/forbid-prop-types": 0,
    "import/no-extraneous-dependencies": [
      "error",
      {
        "devDependencies": ['testcafe/**/*.js'],
      },
    ],
  },
  "settings": {
    "import/resolver": "webpack",
  },
};
