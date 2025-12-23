import config from '@nest-boot/eslint-config';
import tsParser from '@typescript-eslint/parser';

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('eslint').Linter.Config[]} */
const config = [
  {
    ignores: ['eslint.config.mjs', 'src/database/migrations/**'],
  },
  ...config,
  {
    languageOptions: {
      /** @type {import('eslint').Linter.Parser} */
      parser: tsParser,
      parserOptions: {
        project: resolve(__dirname, 'tsconfig.json'),
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowBoolean: true,
          allowNumber: true,
        },
      ],
      '@typescript-eslint/no-unsafe-enum-comparison': 'off',
    },
  },
];

export default config;
