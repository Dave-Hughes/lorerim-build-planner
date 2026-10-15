/**
 * WO-86: the coming soon page, third pass. Iriel's gear timeline and level cards (the app's own, from
 * her fixture) play on the page's clock. Playwright's clock moves the timers. (WO-87 replaced the
 * hero's six shots with pixel art: wo87.spec.ts.)
 */
import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 1440, height: 900 } });

const TICK = 280;
test("with reduced motion nothing moves: the tree and gear at 50, the level 1 card", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.clock.install();
  await page.goto("/coming-soon");
  await page.clock.runFor(30 * TICK);
  await expect(page.locator("[data-level]")).toHaveText("50");
  await expect(page.locator('[data-live="gear"]').getByRole("heading", { level: 2 })).toHaveText(/Gear\s*at level 50/);
  await expect(page.locator("[data-card]")).toHaveAttribute("data-card", "1-1");
});

test("at level 14 the gear shows New: Elven Light Bow, Elven Arrow; the card steps to Levels 36 to 42 with its range on the ruler", async ({ page }) => {
  await page.clock.install();
  await page.goto("/coming-soon");
  const level = page.locator("[data-level]");
  await expect(level).toHaveText("20");
  // 20 to 50, the hold, then from 1: level 14 is 47 + 13 ticks in.
  await page.clock.runFor(60 * TICK);
  await expect(level).toHaveText("14");
  const gear = page.locator('[data-live="gear"]');
  await expect(gear.getByRole("heading", { level: 2 })).toHaveText(/Gear\s*at level 14/);
  await expect(gear).toContainText("New: Elven Light Bow, Elven Arrow");

  // The cards: one every 5 ticks; Levels 36 to 42 is the 36th.
  const cards = page.locator('[data-live="cards"]');
  for (let i = 0; i < 40 && (await cards.locator("[data-card]").getAttribute("data-card")) !== "36-42"; i++) await page.clock.runFor(5 * TICK);
  await expect(cards.locator("[data-card]")).toHaveAttribute("data-card", "36-42");
  await expect(cards.locator("[data-card]")).toHaveText(/Levels 36 to\s*42\s*of 50/);
  await expect(cards.getByRole("region", { name: "Levels 36 to 42" })).toBeVisible();
  const box = cards.locator("[data-range]");
  await expect(box).toHaveAttribute("data-range", "36-42");
  expect(await box.evaluate((el) => (el as HTMLElement).style.left)).toBe("70%");
});
