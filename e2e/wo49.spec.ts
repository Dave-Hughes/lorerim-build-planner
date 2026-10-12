import { expect, test, type Page } from "@playwright/test";
import { PURE_MAGE_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });

/** The bottom of the pinned bar (0 when it isn't showing). */
const pinnedBottom = (page: Page) =>
  page.evaluate(() => Math.max(0, ...[...document.querySelectorAll<HTMLElement>("[data-pinned-bar], [data-edit-bar]")].map((el) => el.getBoundingClientRect().bottom)));

test("Read the full guide brings the Guide tab's row into view", async ({ page }) => {
  // A short window: Pure Mage has no cover, so at 900 tall its tab row is never below the fold.
  await page.setViewportSize({ width: 1440, height: 480 });
  await page.goto(`/b/${PURE_MAGE_BUILD_ID}`);
  // Scroll so the link sits at the window's foot, just past the hero: the tab row is below the fold.
  const link = page.getByRole("button", { name: "Read the full guide" });
  await link.evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().bottom + window.scrollY - window.innerHeight + 20));
  await expect(page.getByRole("tablist", { name: "Build sections" })).not.toBeInViewport();
  await page.getByRole("button", { name: "Read the full guide" }).click();
  await expect(page.getByRole("tab", { name: /^Guide/ })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tablist", { name: "Build sections" })).toBeInViewport({ ratio: 1 });
});

for (const section of ["Gear", "Spells"])
  test(`→ keeps ${section} still while the level changes`, async ({ page }) => {
    await page.goto(`/b/${PURE_MAGE_BUILD_ID}?level=20`);
    const name = (n: number) => `${section} at level ${n}`;
    const region = (n: number) => page.getByRole("region", { name: name(n) });
    // Put the section's top just under the pinned bars.
    await region(20).evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 200));
    await page.waitForTimeout(300);
    const under = await pinnedBottom(page);
    await region(20).evaluate((el, y) => window.scrollBy(0, el.getBoundingClientRect().top - y - 12), under);
    await page.waitForTimeout(300);
    let top = (await region(20).boundingBox())!.y;
    for (let n = 21; n <= 23; n++) {
      await page.keyboard.press("ArrowRight");
      await expect(region(n)).toBeVisible();
      const now = (await region(n).boundingBox())!.y;
      expect(Math.abs(now - top), `${name(n)} moved`).toBeLessThanOrEqual(4);
      top = now;
    }
  });

test("the arrow-key hint shows after two clicks on ›, and never again once an arrow key is used", async ({ page }) => {
  await page.goto(`/b/${PURE_MAGE_BUILD_ID}?level=5`);
  await page.evaluate(() => window.localStorage.removeItem("lbp.arrowTip"));
  const next = page.getByRole("region", { name: "Level", exact: true }).getByRole("button", { name: "Next level (→)" });
  const tip = page.getByRole("status").filter({ hasText: "step through levels" });
  await next.click();
  await expect(tip).toHaveCount(0);
  await next.click();
  await expect(tip).toBeVisible();
  await expect(tip).toContainText("Tip: ← and → step through levels");
  await page.keyboard.press("ArrowRight");
  await expect(tip).toHaveCount(0);

  await page.reload();
  const again = page.getByRole("region", { name: "Level", exact: true }).getByRole("button", { name: "Next level (→)" });
  await again.click();
  await again.click();
  await page.waitForTimeout(300);
  await expect(tip).toHaveCount(0);
});
