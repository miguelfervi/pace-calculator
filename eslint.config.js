import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import vue from "eslint-plugin-vue";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import vueParser from "vue-eslint-parser";

export default [
  js.configs.recommended,
  ...vue.configs["flat/recommended"],
  {
    files: ["**/*.{js,ts}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        console: "readonly",
        process: "readonly",
        module: "readonly",
        require: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        Event: "readonly",
        HTMLInputElement: "readonly",
        HTMLSelectElement: "readonly",
        HTMLElement: "readonly",
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
      prettier: prettier,
    },
    rules: {
      ...prettierConfig.rules,
      "prettier/prettier": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "no-unused-vars": "off",
    },
  },
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: typescriptParser,
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        console: "readonly",
        Event: "readonly",
        HTMLInputElement: "readonly",
        HTMLSelectElement: "readonly",
        HTMLElement: "readonly",
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
      vue: vue,
      prettier: prettier,
    },
    rules: {
      ...prettierConfig.rules,
      "prettier/prettier": "error",
      "vue/multi-word-component-names": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "coverage/**",
      "**/coverage/**",
      "*.min.js",
      "*.min.css",
      ".git/**",
    ],
  },
  {
    files: ["**/__tests__/**", "**/*.test.ts", "**/*.test.js"],
    languageOptions: {
      globals: {
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        jest: "readonly",
        HTMLElement: "readonly",
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
    },
  },
];
