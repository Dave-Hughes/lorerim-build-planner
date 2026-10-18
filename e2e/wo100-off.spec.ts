/**
 * WO-100: the Quests pages switched off, on the "launch" project's server (FEATURE_QUESTS off).
 */
import { expect, test } from "@playwright/test";

test("with FEATURE_QUESTS off, /quests and its pages are not found and the header has no Quests link", async ({ page }) => {
  for (const path of ["/quests", "/quests/c/daedric-princes", "/quests/wyrmstooth"]) expect((await page.goto(path))?.status(), path).toBe(404);
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "Site" }).getByRole("link", { name: "Builds" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Site" }).getByRole("link", { name: "Quests" })).toHaveCount(0);
});
