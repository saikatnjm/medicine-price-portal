import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Architecture rule: UI talks to services via "@/data", never to the
    // local provider or raw seed files.
    files: ["src/app/**/*.{ts,tsx}", "src/components/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/data/local",
                "@/data/local/*",
                "**/data/local/**",
                "**/seed/*.json",
                "@/repositories",
                "@/repositories/*",
                "@/services",
                "@/services/*",
              ],
              message:
                "UI must not import the data provider, repositories or service modules. Use `services` from '@/data'.",
            },
          ],
        },
      ],
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "coverage/**", "next-env.d.ts"]),
]);
