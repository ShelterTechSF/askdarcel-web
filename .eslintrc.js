const path = require("path");

module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:import/recommended",
    "prettier",
    "react-app",
    "react-app/jest",
    "plugin:jsx-a11y/recommended",
    "plugin:import/typescript",
  ],
  plugins: ["react", "jsx-a11y", "import", "@typescript-eslint"],
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
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
    "import/no-named-as-default": 0,
    "jsx-a11y/label-has-associated-control": ["error", { assert: "either" }],
    "no-console": "warn",
    "react-hooks/exhaustive-deps": "error", // Default is 'warn'; we upgrade to 'error' because otherwise warnings are just noise
    "react/jsx-filename-extension": ["error", { extensions: [".tsx"] }],
    "react/function-component-definition": [
      "error",
      { namedComponents: "arrow-function" },
    ],
  },
};
