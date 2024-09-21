import { fileURLToPath } from "node:url";
import { defineConfig } from "@playwright/test";
import type { ConfigOptions } from "@nuxt/test-utils/playwright";

export default defineConfig<ConfigOptions>({
  use: {
    nuxt: {
      rootDir: fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  timeout: 2 * 60 * 1000, // 2 minutes
  testDir: "tests/e2e/",
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],
});
