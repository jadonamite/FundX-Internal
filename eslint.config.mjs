import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Clarinet vitest suite — type-checked/linted by contracts/ own toolchain.
    "contracts/tests/**",
    // Operational contract scripts — run directly with Node, not part of the app build.
    "contracts/FundTalos.cjs",
    "contracts/run-cycle.cjs",
    "contracts/resume-cycle.cjs",
    "contracts/find-owner.cjs",
    "contracts/test-address.cjs",
    "contracts/test-new-contracts.cjs",
  ]),
  // CommonJS Node scripts legitimately use require(); the rule targets app/browser code.
  {
    files: ["**/*.cjs"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
]);

export default eslintConfig;
