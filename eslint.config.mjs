import next from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

// `next lint` is deprecated in Next 15.5 and removed in 16, so the project runs
// the ESLint CLI. eslint-config-next ships flat config natively, so the
// eslintrc compatibility layer is gone.
const config = [
  {
    ignores: [".next/**", "out/**", "node_modules/**", ".audit/**", "next-env.d.ts"],
  },
  ...next,
  ...nextTypescript,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
    },
  },
];

export default config;
