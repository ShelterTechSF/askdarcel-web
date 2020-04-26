module.exports = {
  extends: [
    'airbnb',
    'plugin:testcafe/recommended',
  ],
  parser: 'babel-eslint',
  plugins: [
    'react',
    'jsx-a11y',
    'import',
    'testcafe',
  ],
  env: {
    browser: true,
  },
  settings: {
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
    'import/resolver': 'webpack',
  },
  rules: {
    'arrow-parens': ['warn', 'as-needed'],
    'camelcase': 'off',
    'import/no-extraneous-dependencies': 'error',
    'import/no-unused-modules': ['error', {
      missingExports: true,
      unusedExports: true,
      ignoreExports: ['app/init.jsx', 'app/store/configureStore.dev.js', 'app/store/configureStore.prod.js'],
    }],
    'import/prefer-default-export': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/label-has-associated-control': ['error', { assert: 'either' }],
    'jsx-a11y/label-has-for': ['error', { required: { some: ['nesting', 'id'] } }],
    'no-console': 'warn',
    'no-underscore-dangle': 'off',
    'react/forbid-prop-types': 'off',
    'react/prefer-stateless-function': 'off',
    'react/prop-types': 'off',
  },
  overrides: [
    // Mocha Tests
    {
      files: ['**/*.spec.js*', 'testing/mocha.js'],
      env: { mocha: true },
      rules: {
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
        // This file is an entrypoints, so it does not require exports.
        'import/no-unused-modules': 'off',
        // Chai assertions may appear like unused expressions
        'no-unused-expressions': 'off',
      },
    },
    // TestCafe
    {
      files: ['testcafe/**'],
      rules: {
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
        // TestCafe uses tagged template literals for DSL reasons, so they are
        // expressions that actually have a stateful effect. This is
        // specifically used in the `fixture` syntax.
        'no-unused-expressions': ['error', { allowTaggedTemplates: true }],
        // The TestCafe test files are entrypoints, so they do not require
        // exports.
        'import/no-unused-modules': 'off',
      },
    },
    // Node.js scripts
    {
      files: [
        'tools/**',
        'webpack.config.js',
      ],
      rules: {
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
        // The tools and webpack.config.js are entrypoints and don't require
        // exports.
        'import/no-unused-modules': 'off',
        'no-console': 'warn',
      },
      settings: {
        'import/resolver': 'node',
      },
    },
    // .eslintrc.js
    {
      files: [
        '.eslintrc.js',
      ],
      rules: {
        // import/no-unused-modules only detects ES6 exports, so ignore
        // CJS-style imports.
        // https://github.com/benmosher/eslint-plugin-import/issues/1469
        'import/no-unused-modules': 'off',
        // Most ESLint rules names have characters which must be quoted, such as
        // '-' or '/', so it's easier to read if all things under "rules" are
        // consistently quoted.
        'quote-props': ['error', 'consistent-as-needed'],
      },
    },
  ],
};
