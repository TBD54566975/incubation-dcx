import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';


export default [
  {
    files : ['**/*.{js,mjs,cjs,ts}'],
    rules : {
      'no-unsafe-optional-chaining' : 'off',
      'key-spacing'                 : [
        'error',
        {
          'singleLine': {
            'beforeColon' : false,
            'afterColon'  : true,
          },
          'align': {
            'beforeColon' : true,
            'afterColon'  : true,
            'on'          : 'colon',
            'mode'        : 'minimum'
          }
        }
      ],
      'quotes': [
        'error',
        'single',
        { 'allowTemplateLiterals': true }
      ],
      'semi'                              : ['error', 'always'],
      'indent'                            : ['error', 2, { 'SwitchCase': 1 }],
      'no-unused-vars'                    : 'off',
      'prefer-const'                      : 'off',
      '@typescript-eslint/no-unused-vars' : [
        'error',
        {
          'vars'               : 'all',
          'args'               : 'after-used',
          'ignoreRestSiblings' : true,
          'argsIgnorePattern'  : '^_',
          'varsIgnorePattern'  : '^_'
        }
      ],
      'no-dupe-class-members'                    : 'off',
      'no-trailing-spaces'                       : ['error'],
      '@typescript-eslint/no-explicit-any'       : 'off',
      '@typescript-eslint/no-non-null-assertion' : 'off',
      '@typescript-eslint/ban-ts-comment'        : 'off'
    },
  },
  {
    languageOptions: { globals: {...globals.browser, ...globals.node} }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

];