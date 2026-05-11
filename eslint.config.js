import js from "@eslint/js";
import ts from "typescript-eslint";

export default [
  {
    ignores: ["dist/", "node_modules/", "art-source/", "public/"]
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    files: ["**/*.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_"
        }
      ]
    }
  }
];
