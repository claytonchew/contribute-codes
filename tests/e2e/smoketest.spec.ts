import { expect, test } from "@nuxt/test-utils/playwright";

test("smoke test", async ({ page }) => {
  await page.goto("/");
  expect(true).toBe(true);
});
