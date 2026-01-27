import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", ".next", "node_modules", "**/*.test.ts", "**/*.test.tsx"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommendedTypeChecked],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ["./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": ["error", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        ignoreRestSiblings: true,
      }],
      // Import ordering for consistent codebase
      "sort-imports": ["error", {
        ignoreCase: true,
        ignoreDeclarationSort: true, // Let developers group imports logically
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
        allowSeparatedGroups: true,
      }],
      // Consistent type imports for better tree-shaking
      "@typescript-eslint/consistent-type-imports": ["error", {
        prefer: "type-imports",
        disallowTypeAnnotations: false,
        fixStyle: "separate-type-imports",
      }],
      // Prevent unhandled promise rejections (silent failures)
      "@typescript-eslint/no-floating-promises": ["error", {
        ignoreVoid: true,
        ignoreIIFE: true,
      }],
      // Ensure promises are awaited or handled
      "@typescript-eslint/no-misused-promises": ["error", {
        checksVoidReturn: {
          arguments: false,
          attributes: false,
        },
      }],
    },
  },
);
