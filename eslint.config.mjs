import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Ban em dashes (—) from all source files.
    // Use a comma, colon, period, or rewrite instead.
    plugins: {
      "no-em-dash": {
        rules: {
          "no-em-dash": {
            create(context) {
              return {
                Literal(node) {
                  if (typeof node.value === "string" && node.value.includes("—")) {
                    context.report({ node, message: "Em dash (—) is banned. Use a comma, colon, or period instead." });
                  }
                },
                TemplateLiteral(node) {
                  node.quasis.forEach(quasi => {
                    if (quasi.value.raw.includes("—")) {
                      context.report({ node: quasi, message: "Em dash (—) is banned. Use a comma, colon, or period instead." });
                    }
                  });
                },
              };
            },
          },
        },
      },
    },
    rules: {
      "no-em-dash/no-em-dash": "error",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
