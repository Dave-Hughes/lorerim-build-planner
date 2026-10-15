/**
 * WO-74: tree labels on phones, labels that read as their star's, and small layout faults. Point 1
 * (level nav) is perf.spec.ts; points 2 and 3's label checks are WO-75's (wo75.spec.ts). Each test is
 * named by its point.
 */
import { expect, test } from "@playwright/test";
import { FOUR_BUILD_ID, SEVARI_BUILD_ID } from "./seed";

test.describe("on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  // Point 2's check is WO-75's now (wo75.spec.ts).

  test("point 5: four cells fill the level row", async ({ page }) => {
    await page.goto(`/b/${FOUR_BUILD_ID}?level=1`);
    const frame = page.locator("[data-row-frame]").first();
    const [f, r] = [await frame.boundingBox(), await frame.locator("> div").boundingBox()];
    expect(Math.abs(r!.width - f!.width)).toBeLessThan(1.5);
  });

  test("point 6: Destiny diamonds on the ruler never overlap", async ({ page }) => {
    await page.goto(`/b/${SEVARI_BUILD_ID}?level=30`);
    const boxes = await page
      .getByLabel("Whole build, levels 1 to 100")
      .locator('[class*="markDestiny"]')
      .evaluateAll((els) => els.map((e) => e.getBoundingClientRect()).map((r) => ({ l: r.left, r: r.right })));
    expect(boxes.length).toBeGreaterThan(3);
    const sorted = boxes.sort((a, b) => a.l - b.l);
    for (let i = 1; i < sorted.length; i++) expect(sorted[i].l, `diamond ${i}`).toBeGreaterThanOrEqual(sorted[i - 1].r - 0.5);
  });
});

test.describe("at 1440", () => {
  test.use({ viewport: { width: 1440, height: 1000 } });

  // Point 3: the 10px between labels became 8px, and the line check became the halo (WO-75, wo75.spec.ts).

  test("point 4: the Taken-by panel keeps a gutter between a tree's name and its first perk", async ({ page }) => {
    await page.goto(`/b/${SEVARI_BUILD_ID}?level=30`);
    // The open tree's group lists its perks; the others fold to a count.
    await page.getByRole("tablist", { name: "Perk trees" }).getByRole("tab", { name: /^One-Handed/ }).click();
    const group = page.getByRole("region", { name: "Taken by level 30", exact: true }).locator('[class*="perkGroup"]').filter({ hasText: "One-Handed" }).first();
    const gap = await group.evaluate((g) => {
      const name = g.firstElementChild!;
      const range = document.createRange();
      range.selectNodeContents(name);
      const perk = g.querySelector("button")!.getBoundingClientRect();
      return perk.left - range.getBoundingClientRect().right;
    });
    expect(gap).toBeGreaterThanOrEqual(10);
  });

  test("point 6: the ruler's numbers stay clear of the selected diamond and the zoom lines", async ({ page }) => {
    await page.goto(`/b/${SEVARI_BUILD_ID}?level=30`);
    const ruler = page.getByLabel("Whole build, levels 1 to 100");
    for (const n of ["1", "30"]) {
      const label = ruler.getByText(n, { exact: true });
      // The number is on top where it sits: nothing drawn over its middle.
      const onTop = await label.evaluate((l) => {
        const r = l.getBoundingClientRect();
        return document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2) === l;
      });
      expect(onTop, `number ${n}`).toBe(true);
    }
  });
});
