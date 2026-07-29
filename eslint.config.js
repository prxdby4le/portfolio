import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  {
    // Vendored shadcn/ui primitives. Several of them export a cva variants
    // object or a hook alongside the component, which is simply how the
    // generator emits them. Splitting those files by hand would be undone the
    // next time any component is re-added with `npx shadcn add`, so the rule is
    // switched off here rather than fought file by file.
    //
    // This exemption covers generated primitives only. Application code keeps
    // the rule: see contexts/player-context.ts and hooks/usePlayer.ts, which
    // were split out of PlayerContext.tsx for exactly this reason.
    files: ["src/components/ui/**/*.{ts,tsx}"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
);
