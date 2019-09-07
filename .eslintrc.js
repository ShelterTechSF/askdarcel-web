module.exports = {
  "extends": [
    "airbnb",
    "plugin:testcafe/recommended",
  ],
  "globals": {
    "CONFIG": true,
    "google": true,
    "describe": true,
    "it": true,
    "NODE_ENV": true,
  },
  "parser": "babel-eslint",
  "plugins": [
    "react",
    "jsx-a11y",
    "import",
    "testcafe",
  ],
  "env": {
    "browser": true,
  },
  "overrides": [
    {
      "files": ["**/__tests__/*.js*"],
      "rules": {
        // Chai assertions may appear like unused expressions
        "no-unused-expressions": ["off"],
      },
    },
    {
      "files": ["testcafe/**"],
      "rules": {
        // TestCafe uses tagged template literals for DSL reasons, so they are
        // expressions that actually have a stateful effect. This is
        // specifically used in the `fixture` syntax.
        "no-unused-expressions": ["error", {"allowTaggedTemplates": true}],
      },
    },
  ],
  "rules": {
    "arrow-parens": [1, "as-needed"],
    "camelcase": 0,
    "import/default": 0,
    "import/no-extraneous-dependencies": 0,
    "import/prefer-default-export": 0,
    "jsx-a11y/click-events-have-key-events": 0,
    "jsx-a11y/label-has-associated-control": ["error", { assert: "either" }],
    "jsx-a11y/label-has-for": ["error", { required: { some: ["nesting", "id"] } }],
    "no-console": 1,
    "no-plusplus": 0,
    "no-prototype-builtins": 0,
    "no-underscore-dangle": 0,
    "react/forbid-prop-types": 0,
    "react/prefer-stateless-function": 0,
    "react/prop-types": 0,
  },
  "settings": {
    "import/resolver": "webpack",
  },
};
