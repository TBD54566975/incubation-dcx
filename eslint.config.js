import eslint from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  eslint.configs.recommended,
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { modules: true },
        ecmaVersion: '2017',
      },
      globals: [
        ...globals.node,
        ...globals.es2017,
        ...globals.browser
      ]
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    files: ['**/*.{js,mjs,cjs,ts,json}'],
    rules: {
      'no-unsafe-optional-chaining': 'off',
      'key-spacing': [
        'error',
        {
          'singleLine': {
            'beforeColon': false,
            'afterColon': true,
          },
          'align': {
            'beforeColon': true,
            'afterColon': true,
            'on': 'colon',
            'mode': 'minimum'
          }
        }
      ],
      'quotes': [
        'error',
        'single',
        { 'allowTemplateLiterals': true }
      ],
      'semi': ['error', 'always'],
      'indent': ['error', 2, { 'SwitchCase': 1 }],
      'no-unused-vars': 'off',
      'prefer-const': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          'vars': 'all',
          'args': 'after-used',
          'ignoreRestSiblings': true,
          'argsIgnorePattern': '^_',
          'varsIgnorePattern': '^_'
        }
      ],
      'no-dupe-class-members': 'off',
      'no-trailing-spaces': ['error'],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'mocha/no-exclusive-tests': 'warn',
      'mocha/no-setup-in-describe': 'off',
      'mocha/no-mocha-arrows': 'off',
      'mocha/max-top-level-suites': 'off',
      'mocha/no-identical-title': 'off',
      'mocha/no-pending-tests': 'off',
      'mocha/no-skipped-tests': 'off',
    },
  },
];
