/**
 * WO-92: the Gear page held back, on the "launch" project's server (FEATURE_GEAR off).
 */
import { expect, test } from "@playwright/test";

test("with FEATURE_GEAR off, /gear and an item page are not found and the header has no Gear link", async ({ page }) => {
  expect((await page.goto("/gear"))?.status()).toBe(404);
  expect((await page.goto("/gear/skyrim-esm-013939"))?.status()).toBe(404);
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Site" });
  await expect(nav.getByRole("link", { name: "Builds" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Gear" })).toHaveCount(0);
});
