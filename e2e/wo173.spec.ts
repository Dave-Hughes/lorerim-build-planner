/**
 * WO-173: the home page as the board. Signed in gets the same hero as signed out (the whole sky, the line, the search box; only the buttons go),
 * and the map strip pans: the paper map is larger than the strip and goes slowly across Skyrim, its pins riding with it and ringing.
 */
import { expect, test, type Page } from "@playwright/test";
import { signIn } from "./helpers";

const anon = { storageState: { cookies: [], origins: [{ origin: "http://localhost:3123", localStorage: [{ name: "planner.tour.offer", value: "done" }, { name: "planner.tour.reader", value: "done" }] }] } };
const hero = (page: Page) => page.locator("section[aria-label='LoreRim Planner']");
const strip = (page: Page) => page.getByRole("region", { name: "Every place, on the game's own map" });

test.describe("signed in", () => {
  test("the hero is the whole scene: the same height as signed out, the sky, Alduin, the line and the search box; only the buttons go", async ({ page, context }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await context.clearCookies();
    await page.goto("/");
    const heightOut = (await hero(page).boundingBox())!.height;
    await signIn(context);
    await page.goto("/");
    const box = (await hero(page).boundingBox())!;
    expect(Math.abs(box.height - heightOut)).toBeLessThan(2);
    await expect(hero(page).getByRole("heading", { level: 1, name: "LoreRim Planner" })).toBeVisible();
    // One line (WO-159): the title is no taller than a line of the pixel face.
    const title = (await hero(page).getByRole("heading", { level: 1 }).boundingBox())!;
    expect(title.height).toBeLessThan(168);
    await expect(hero(page).getByText(/Plan a LoreRim character from the first perk/)).toBeVisible();
    await expect(hero(page).getByRole("button", { name: /Search/ })).toBeVisible();
    await expect(hero(page).getByRole("link", { name: "Make a character" })).toHaveCount(0);
    await expect(hero(page).getByRole("link", { name: "Browse characters" })).toHaveCount(0);
    expect(await hero(page).locator("[class*='alduin']").count()).toBe(1);
    expect(await hero(page).locator("[class*='embers'] i").count()).toBeGreaterThan(5);
    expect(await hero(page).locator("img[class*='layer']").count()).toBeGreaterThan(10);
    await page.screenshot({ path: "test-results/wo173-home-signed-in-1440.png" });
    // On a phone too: as tall as it is with the buttons.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    const phoneIn = (await hero(page).boundingBox())!.height;
    await page.screenshot({ path: "test-results/wo173-home-signed-in-390.png" });
    await context.clearCookies();
    await page.reload();
    expect(Math.abs(phoneIn - (await hero(page).boundingBox())!.height)).toBeLessThan(2);
  });
});

test.describe("the map strip pans", () => {
  test.use(anon);

  for (const width of [1440, 390]) {
    test(`at ${width}: larger than the strip, going across Skyrim, never past the frame, the pins ringing`, async ({ page }) => {
      await page.setViewportSize({ width, height: width === 1440 ? 900 : 844 });
      await page.goto("/");
      await strip(page).scrollIntoViewIfNeeded();
      const frame = async () => {
        const s = (await strip(page).boundingBox())!;
        const m = (await strip(page).locator("[class*='picture']").boundingBox())!;
        return { s, m };
      };
      const a = await frame();
      expect(a.m.width / a.s.width).toBeGreaterThan(width === 1440 ? 1.45 : 2.5);
      await page.screenshot({ path: `test-results/wo173-strip-a-${width}.png` });
      await page.waitForTimeout(5000);
      const b = await frame();
      // It moved, leftwards, and the picture still covers the strip on every side.
      expect(a.m.x - b.m.x).toBeGreaterThan(width === 1440 ? 4 : 0.3);
      for (const f of [a, b]) {
        expect(f.m.x).toBeLessThanOrEqual(f.s.x + 1);
        expect(f.m.x + f.m.width).toBeGreaterThanOrEqual(f.s.x + f.s.width - 1);
        expect(f.m.y).toBeLessThanOrEqual(f.s.y + 1);
        expect(f.m.y + f.m.height).toBeGreaterThanOrEqual(f.s.y + f.s.height - 1);
      }
      await page.screenshot({ path: `test-results/wo173-strip-b-${width}.png` });
      // The pins ride on the picture and ring.
      const pin = strip(page).locator("i[class*='pin']").first();
      expect(await strip(page).locator("i[class*='pin']").count()).toBeGreaterThan(4);
      expect(await pin.evaluate((el) => getComputedStyle(el, "::after").animationName)).toContain("ring");
      expect(await strip(page).locator("[class*='picture']").evaluate((el) => getComputedStyle(el.parentElement!).animationName)).toContain("pan");
      await expect(strip(page).getByRole("link", { name: /Map: Skyrim Paper Map by Caro Tuts/ })).toBeVisible();
    });
  }

  test("reduced motion keeps it still, and the frame's edge is still out of sight", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await strip(page).scrollIntoViewIfNeeded();
    const x = async () => (await strip(page).locator("[class*='picture']").boundingBox())!.x;
    const x0 = await x();
    await page.waitForTimeout(1500);
    expect(await x()).toBe(x0);
    const s = (await strip(page).boundingBox())!;
    const m = (await strip(page).locator("[class*='picture']").boundingBox())!;
    expect(m.x).toBeLessThanOrEqual(s.x);
    expect(m.x + m.width).toBeGreaterThanOrEqual(s.x + s.width);
  });
});
