import { expect, test } from "@playwright/test";
import { AZREM_BUILD_ID } from "./seed";

test.describe("with prefers-reduced-motion", () => {
  test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });

  test("the hero doesn't move: no title transform, no parallax on scroll", async ({ page }) => {
    await page.goto(`/b/${AZREM_BUILD_ID}`);
    const title = page.getByRole("heading", { level: 1 });
    await expect(title).toBeVisible();
    expect(await title.evaluate((el) => getComputedStyle(el).transform)).toBe("none");
    const layer = page.locator('section[aria-label="Build"] > div').first();
    const before = await layer.evaluate((el) => getComputedStyle(el).transform);
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(300);
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
    expect(await layer.evaluate((el) => getComputedStyle(el).transform)).toBe(before);
  });
});

test.describe("with motion", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("the cover drifts at half the scroll speed and the hero text fades", async ({ page }) => {
    await page.goto(`/b/${AZREM_BUILD_ID}`);
    await page.waitForTimeout(1200);
    await page.mouse.wheel(0, 200);
    await page.waitForTimeout(300);
    const y = await page.evaluate(() => window.scrollY);
    const layer = page.locator('section[aria-label="Build"] > div').first();
    const ty = await layer.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m42);
    expect(Math.abs(ty - y / 2)).toBeLessThanOrEqual(1);
  });
});
