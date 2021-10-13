module.exports = {
  extends: [
    'airbnb',
    'plugin:testcafe/recommended',
  ],
  plugins: [
    'react',
    'jsx-a11y',
    'import',
    'testcafe',
    '@typescript-eslint',
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
    'import/extensions': ['error', {
      js: 'never', jsx: 'never', ts: 'never', tsx: 'never',
    }],
    'import/no-extraneous-dependencies': 'error',
    'import/no-named-as-default': 0,
    'import/no-named-as-default-member': 0,
    'import/prefer-default-export': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/label-has-associated-control': ['error', { assert: 'either' }],
    'jsx-a11y/label-has-for': ['off'], // This is deprecated in favor of jsx-a11y/label-has-associated-control
    'no-console': 'warn',
    'no-underscore-dangle': 'off',
    'react/forbid-prop-types': 'off',
    'react/prefer-stateless-function': 'off',
    'react/prop-types': 'off',
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx', '.jsx'] }],
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
      },
      rules: {
        '@typescript-eslint/member-delimiter-style': ['error', { multiline: { delimiter: 'semi', requireLast: true } }],
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/require-await': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/unbound-method': 'off',
        'no-use-before-define': 'off',
        'no-unused-vars': 'off',
        'react/require-default-props': 'off',
        'spaced-comment': ['error', 'always', { markers: ['/'] }],
      },
    },
    {
      // Non-TypeScript, JavaScript files
      files: ['*.js', '*.jsx'],
      parser: '@babel/eslint-parser',
      rules: {
        'react/sort-comp': 'off',
        // Disable TypeScript-specific rules on regular JavaScript files.
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/require-await': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
      },
    },
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
    // Cypress
    {
      files: ['cypress/**'],
      rules: {
        'newline-per-chained-call': 'off',
        'lines-between-class-members': 'off',
        'indent': 'off',
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
