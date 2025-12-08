//  @ts-check

import { tanstackConfig } from "@tanstack/eslint-config";
import simpleImportSort from "eslint-plugin-simple-import-sort";

export default [
  ...tanstackConfig,
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
