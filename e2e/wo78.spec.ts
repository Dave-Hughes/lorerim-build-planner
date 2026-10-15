/**
 * WO-78: trees go back to Fit on a new level, the pinned bar loses its tabs, and the level note's
 * heading is "About this level". Each test is named by its point.
 */
import { expect, test, type Locator, type Page } from "@playwright/test";
import { signIn } from "./helpers";
import { AZREM_BUILD_ID, SEVARI_BUILD_ID } from "./seed";

const sky = (page: Page, tree: string) => page.locator(`[aria-label="${tree} tree: drag or use the arrow keys to move around, Ctrl and the wheel to zoom"]`).first();

/** Zooms the tree in its box in, twice, and checks it's off Fit. */
async function zoomIn(box: Locator) {
  await box.getByRole("button", { name: "Zoom in" }).click();
  await box.getByRole("button", { name: "Zoom in" }).click();
  await expect(box.getByRole("button", { name: "Fit", exact: true })).toBeEnabled();
}

test.describe("at 1440", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("point 1: the build page's One-Handed goes back to Fit on a new level, and on coming back to the tree", async ({ page }) => {
    await page.goto(`/b/${SEVARI_BUILD_ID}?level=2`);
    const perks = page.getByRole("region", { name: "Perks at level 2" });
    await perks.getByRole("tab", { name: /^One-Handed/ }).click();
    await zoomIn(perks);
    await page.getByRole("button", { name: "Next level (→)" }).first().click();
    const next = page.getByRole("region", { name: /^Perks at level/ });
    await expect(next).not.toHaveAccessibleName("Perks at level 2");
    await expect(next.getByRole("button", { name: "Fit", exact: true })).toBeDisabled();
    // Another tree and back: Fit again.
    await zoomIn(next);
    await next.getByRole("tab", { name: /^Sneak/ }).click();
    await next.getByRole("tab", { name: /^One-Handed/ }).click();
    await expect(next.getByRole("button", { name: "Fit", exact: true })).toBeDisabled();
  });

  test("point 1: the editor's tree goes back to Fit on a new level", async ({ page, context }) => {
    await signIn(context);
    await page.goto(`/b/${SEVARI_BUILD_ID}/edit?level=2`);
    await page.getByRole("region", { name: "Attribute and skills" }).getByRole("button", { name: "One-Handed", exact: true }).click();
    const panel = sky(page, "One-Handed").locator("xpath=ancestor::*[.//button[@aria-label='Zoom in']][1]");
    await zoomIn(panel);
    await page.getByRole("button", { name: "Next level", exact: true }).click();
    await expect(page).toHaveURL(/level=(?!2\b)\d+/);
    await expect(panel.getByRole("button", { name: "Fit", exact: true })).toBeDisabled();
  });

  test("point 2: the pinned bar has no tabs, and shows on the Levels tab only", async ({ page }) => {
    await page.goto(`/b/${AZREM_BUILD_ID}?level=6`);
    await page.getByRole("region", { name: "Perks at level 6" }).scrollIntoViewIfNeeded();
    const bar = page.getByRole("region", { name: "Pinned bar" });
    await expect(bar).toBeVisible();
    await expect(bar.getByRole("button", { name: /^(Levels|Guide|Story)$/ })).toHaveCount(0);
    await expect(bar.getByRole("tab")).toHaveCount(0);
    await page.getByRole("tablist", { name: "Build sections" }).getByRole("tab", { name: /^Guide/ }).click();
    await page.mouse.wheel(0, 2000);
    await expect(bar).toHaveCount(0);
  });

  test("point 3: the note's heading on the build page, a single level and a stretch", async ({ page }) => {
    await page.goto(`/b/${AZREM_BUILD_ID}?level=6`);
    const note = page.getByRole("complementary", { name: "Author's note" });
    await expect(note.getByRole("heading", { name: "About this level", exact: true })).toBeVisible();
    await page.goto(`/b/${SEVARI_BUILD_ID}?level=75`);
    await expect(note.getByRole("heading", { name: "About this level range", exact: true })).toBeVisible();
  });

  test("point 3: the note's heading in the editor, a single level and a stretch", async ({ page, context }) => {
    await signIn(context);
    await page.goto(`/b/${SEVARI_BUILD_ID}/edit?level=2`);
    await expect(page.getByRole("region", { name: "About level 2" })).toContainText("About this level");
    await page.goto(`/b/${SEVARI_BUILD_ID}/edit?level=75`);
    const stretch = page.getByRole("region", { name: "About levels 51 to 75" });
    await expect(stretch).toContainText("About this level range");
  });
});

test.describe("on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test("point 1: the phone's tree goes back to Fit on a new level", async ({ page }) => {
    await page.goto(`/b/${SEVARI_BUILD_ID}?level=2`);
    await page.getByRole("button", { name: "Tree", exact: true }).first().click();
    const perks = page.getByRole("region", { name: "Perks at level 2" });
    await perks.getByRole("tab", { name: /^One-Handed/ }).click();
    await zoomIn(perks);
    await page.getByRole("button", { name: "Next level (→)" }).first().click();
    const next = page.getByRole("region", { name: /^Perks at level/ });
    await expect(next).not.toHaveAccessibleName("Perks at level 2");
    await expect(next.getByRole("button", { name: "Fit", exact: true })).toBeDisabled();
  });
});
