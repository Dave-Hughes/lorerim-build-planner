/**
 * WO-77: the pinned bar on a stretch. More folds (perks by tree, perks as one chip, skills as one chip),
 * and a chip is never cut: what doesn't fit is behind `+N more`, which goes to the level card.
 */
import { expect, test, type Page } from "@playwright/test";
import { SEVARI_BUILD_ID } from "./seed";

/** Opens the build at a level and scrolls past the stepper, so the pinned bar shows. */
async function pinned(page: Page, level: number) {
  await page.goto(`/b/${SEVARI_BUILD_ID}?level=${level}`);
  await page.locator("#perks").scrollIntoViewIfNeeded();
  const bar = page.getByRole("region", { name: "Pinned bar" });
  await expect(bar).toBeVisible();
  return bar.getByLabel(/^What level \d+ changed$/);
}

for (const width of [1440, 1280])
  test.describe(`at ${width}`, () => {
    test.use({ viewport: { width, height: 900 } });

    for (const level of [75, 100])
      test(`point 1 and 2: the stretch to level ${level} is one line, every chip whole, nothing ending in …`, async ({ page }) => {
        const summary = await pinned(page, level);
        // The folds settle a frame after the bar shows.
        await page.waitForTimeout(100);
        const f = await summary.evaluate((el) => {
          const b = el.getBoundingClientRect();
          const chips = ([...el.children] as HTMLElement[]).filter((c) => !c.getAttribute("aria-hidden")).map((c) => c.getBoundingClientRect());
          return {
            chips: chips.length,
            outside: chips.filter((r) => r.left < b.left - 0.5 || r.right > b.right + 0.5).length,
            rows: new Set(chips.map((r) => Math.round(r.top))).size,
            after: getComputedStyle(el, "::after").content,
          };
        });
        expect(f.chips).toBeGreaterThan(2);
        expect(f.outside, "chips past the edge").toBe(0);
        expect(f.rows, "lines").toBe(1);
        expect(f.after).not.toContain("…");
        expect(await summary.innerText()).not.toMatch(/…\s*$/);
      });
  });

test.describe("too narrow for every fold", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("point 2: +N more scrolls to the level card", async ({ page }) => {
    const summary = await pinned(page, 75);
    // Sevari's stretches fit at every desktop width once folded, so the row is squeezed to 200px here.
    await expect(summary.getByRole("button", { name: /^\+\d+ more$/ })).toHaveCount(0);
    await summary.evaluate((el) => (el.style.maxWidth = "200px"));
    const more = summary.getByRole("button", { name: /^\+\d+ more$/ });
    await expect(more).toBeVisible();
    // Every chip left is whole, and the button is inside the row.
    const outside = await summary.evaluate((el) => {
      const b = el.getBoundingClientRect();
      return ([...el.children] as HTMLElement[]).filter((c) => !c.getAttribute("aria-hidden")).filter((c) => c.getBoundingClientRect().right > b.right + 0.5).length;
    });
    expect(outside).toBe(0);
    await more.click();
    await expect(page.locator("#level-card")).toBeInViewport();
  });
});
