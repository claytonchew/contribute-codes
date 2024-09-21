import { defineVitestConfig } from "@nuxt/test-utils/config";

export default defineVitestConfig({
  test: {
    environment: "nuxt",
    exclude: ["**/node_modules/**/*", "tests/e2e/**/*"],
    reporters: process.env.CI ? ["verbose", "github-actions"] : ["verbose"],
  },
});
