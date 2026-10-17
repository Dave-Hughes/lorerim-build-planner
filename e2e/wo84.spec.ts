/** WO-84 with the switch off (the main server): the app as usual; the page itself at /coming-soon. */
import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 1440, height: 900 } });

test("point 1: with the switch off, / is the usual home page", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Builds" })).toBeVisible();
  await expect(page.getByText("Opening soon")).toHaveCount(0);
});

test("point 4: with reduced motion the counter reads 50 and all 15 of Iriel's Marksman perks are lit", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/coming-soon");
  const band = page.getByRole("region", { name: "Iriel Thornwhisper's Marksman perks" });
  await expect(band.locator("[data-level]")).toHaveText("50");
  await expect(band.getByRole("list", { name: "Taken" }).getByRole("listitem")).toHaveCount(15);
  // The app's own tree, read only: 15 of its stars drawn taken, and none of them buttons anyone can reach.
  const stars = band.locator('[data-tree="Marksman"] button[data-perk^="Marksman:"]');
  await expect(stars.first()).toBeAttached();
  const lit = await stars.evaluateAll((els) => els.filter((e) => /taken/.test(e.className)).length);
  expect(lit).toBe(15);
  expect(await stars.evaluateAll((els) => els.every((e) => e.getAttribute("tabindex") === "-1"))).toBe(true);
  // The story holds still: since the cutscene (15 Oct), on its first scene's first frame.
  await expect(page.locator('img[src="/coming-soon/px/p1-0.png"]')).toBeVisible();
});

test("point 3: without reduced motion the tree opens at level 20 (WO-85) and counts up as the page scrolls past it (17 Oct)", async ({ page }) => {
  await page.goto("/coming-soon");
  const n = page.locator("[data-level]");
  await expect(n).toHaveText("20");
  await n.scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 300);
  await expect.poll(async () => Number(await n.textContent()), { timeout: 5000 }).toBeGreaterThan(22);
});
