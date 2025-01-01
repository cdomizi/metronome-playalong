import { default as eslint } from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: [
      "**/node_modules/",
      "**/dist/",
      "**/dist-ssr/",
      "*.local",
      "**/.yarn/",
      ".pnp*.*js",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      globals: {
        ...globals.es2023,
        ...globals.browser,
      },
      parserOptions: {
        project: ["tsconfig.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: { ["@typescript-eslint"]: tseslint.plugin },
    rules: {
      "no-unused-vars": 0,
      "@typescript-eslint/no-unused-vars": 1,
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/prefer-nullish-coalescing": 0,
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: false,
        },
      ],
      "@typescript-eslint/no-namespace": [2, { allowDeclarations: true }],
    },
  },
  // Disable type-aware linting for JS files
  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    ...tseslint.configs.disableTypeChecked,
  },
  // Prettier config
  prettierConfig,
];
