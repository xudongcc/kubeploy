import baseConfig from '@nest-boot/eslint-config';

/** @type {import('eslint').Linter.Config[]} */
const config = [
  {
    ignores: ['eslint.config.mjs', 'src/database/migrations/**'],
  },
  ...baseConfig,
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
