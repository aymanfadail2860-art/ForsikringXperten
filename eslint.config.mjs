import next from "eslint-config-next";

/**
 * eslint-config-next v16 ships a flat config array directly, so it is spread
 * rather than wrapped in FlatCompat.
 */
const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "next-env.d.ts",
      "playwright-report/**",
      "test-results/**",
    ],
  },
  ...next,
  {
    // Scoped to TS: the @typescript-eslint plugin is only registered for these
    // files by next/typescript, and referencing its rules elsewhere errors.
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
];

export default eslintConfig;
