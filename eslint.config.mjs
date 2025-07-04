import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import prettier from 'eslint-config-prettier/flat';
import importHelpers from 'eslint-plugin-import-helpers';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    ignores: ['node_modules'],
  },
  {
    plugins: {
      '@stylistic': stylistic,
      'import-helpers': importHelpers,
    },
    extends: [eslint.configs.recommended, tseslint.configs.recommended, stylistic.configs.recommended, prettier],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: 'tsconfig.json',
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },
  {
    rules: {
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: ['const', 'let', 'export'], next: '*' },
        { blankLine: 'always', prev: '*', next: ['const', 'let', 'export'] },
        { blankLine: 'any', prev: ['const', 'let'], next: ['const', 'let'] },
      ],
      'import-helpers/order-imports': [
        'error',
        {
          newlinesBetween: 'always',
          groups: ['module', '/^@shared/', ['parent', 'sibling', 'index']],
          alphabetize: { order: 'asc', ignoreCase: true },
        },
      ],
    },
  },
]);
