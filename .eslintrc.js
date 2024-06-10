const path = require("path");

module.exports = {
  extends: [
    "airbnb",
    "plugin:testcafe/recommended",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  plugins: ["react", "jsx-a11y", "import", "testcafe", "@typescript-eslint"],
  env: {
    browser: true,
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        paths: [path.resolve(__dirname, "app")],
      },
    },
  },
  rules: {
    camelcase: "off",
    "import/extensions": [
      "error",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    "import/no-extraneous-dependencies": "error",
    "import/no-named-as-default": 0,
    "import/no-named-as-default-member": 0,
    "import/prefer-default-export": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/label-has-associated-control": ["error", { assert: "either" }],
    "jsx-a11y/label-has-for": ["off"], // This is deprecated in favor of jsx-a11y/label-has-associated-control
    "no-console": "warn",
    "no-underscore-dangle": "off",
    "react-hooks/exhaustive-deps": "error", // Default is 'warn'; we upgrade to 'error' because otherwise warnings are just noise
    "react/forbid-prop-types": "off",
    "react/no-danger": "off",
    "react/prefer-stateless-function": "off",
    "react/prop-types": "off",
    "react/jsx-filename-extension": ["error", { extensions: [".tsx"] }],
    "react/function-component-definition": [
      "error",
      { namedComponents: "arrow-function" },
    ],
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      extends: [
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
      ],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig.json",
      },
      rules: {
        "@typescript-eslint/member-delimiter-style": [
          "error",
          { multiline: { delimiter: "semi", requireLast: true } },
        ],
        "@typescript-eslint/no-floating-promises": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/no-unused-expressions": "error",
        "@typescript-eslint/require-await": "off",
        "@typescript-eslint/restrict-template-expressions": "off",
        "@typescript-eslint/unbound-method": "off",
        "arrow-body-style": "off",
        "no-unused-expressions": "off",
        "no-unused-vars": "off",
        "no-use-before-define": "off",
        "react/require-default-props": "off",
        "react/no-unstable-nested-components": "off",
        "react/jsx-props-no-spreading": "off",
        "max-classes-per-file": "off",
        "spaced-comment": ["error", "always", { markers: ["/"] }],
      },
    },
    {
      // Non-TypeScript, JavaScript files
      files: ["*.js", "*.jsx"],
      parser: "@babel/eslint-parser",
      rules: {
        "react/sort-comp": "off",
        // Disable TypeScript-specific rules on regular JavaScript files.
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/require-await": "off",
        "@typescript-eslint/restrict-template-expressions": "off",
        "react/jsx-props-no-spreading": "off",
        "max-classes-per-file": "off",
        "default-param-last": "off",
      },
    },
    // Mocha Tests
    {
      files: ["**/*.spec.[jt]s*", "testing/mocha.js"],
      env: { mocha: true },
      rules: {
        "import/no-extraneous-dependencies": [
          "error",
          { devDependencies: true },
        ],
        // This file is an entrypoints, so it does not require exports.
        "import/no-unused-modules": "off",
        // Chai assertions may appear like unused expressions
        "no-unused-expressions": "off",
        "@typescript-eslint/no-unused-expressions": "off",
      },
    },
    // TestCafe
    {
      files: ["testcafe/**"],
      rules: {
        "import/no-extraneous-dependencies": [
          "error",
          { devDependencies: true },
        ],
        // TestCafe uses tagged template literals for DSL reasons, so they are
        // expressions that actually have a stateful effect. This is
        // specifically used in the `fixture` syntax.
        "no-unused-expressions": ["error", { allowTaggedTemplates: true }],
        // The TestCafe test files are entrypoints, so they do not require
        // exports.
        "import/no-unused-modules": "off",
      },
    },
    // Cypress
    {
      files: ["cypress/**"],
      rules: {
        "newline-per-chained-call": "off",
        "lines-between-class-members": "off",
        indent: "off",
      },
    },
    // Node.js scripts
    {
      files: ["tools/**", "webpack.config.js"],
      rules: {
        "import/no-extraneous-dependencies": [
          "error",
          { devDependencies: true },
        ],
        // The tools and webpack.config.js are entrypoints and don't require
        // exports.
        "import/no-unused-modules": "off",
        "no-console": "warn",
      },
      settings: {
        "import/resolver": "node",
      },
    },
    // .eslintrc.js
    {
      files: [".eslintrc.js"],
      rules: {
        // import/no-unused-modules only detects ES6 exports, so ignore
        // CJS-style imports.
        // https://github.com/benmosher/eslint-plugin-import/issues/1469
        "import/no-unused-modules": "off",
      },
    },
  ],
};
