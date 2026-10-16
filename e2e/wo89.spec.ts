/**
 * WO-89: Aurora, a guide theme in the coming soon page's look. A build with no cover gets the pixel
 * scene in its hero; one with a cover keeps it. The build's title is set in Jersey 10 in Aurora only.
 */
import { expect, test, type Page } from "@playwright/test";
import { signIn } from "./helpers";
import { AURORA_BUILD_ID, IRIEL_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });

const hero = (page: Page) => page.getByRole("region", { name: "Build", exact: true });

async function pickAndSave(page: Page, id: string, theme: string) {
  await page.goto(`/b/${id}/setup?step=name`);
  const picker = page.getByRole("group", { name: "Theme" });
  await expect(picker.getByRole("button")).toHaveCount(6);
  const card = picker.getByRole("button", { name: new RegExp(`^${theme}`) });
  await card.click();
  await expect(card).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.waitForURL(new RegExp(`/b/${id}/edit`));
}

test("Aurora on a build with no cover: the pixel scene in the hero, crisp, and the title in Jersey 10", async ({ page, context }) => {
  await signIn(context);
  await pickAndSave(page, AURORA_BUILD_ID, "Aurora");
  await page.goto(`/b/${AURORA_BUILD_ID}`);
  await expect(page.locator("[data-theme]").first()).toHaveAttribute("data-theme", "aurora");
  const bg = await hero(page).evaluate((el) => {
    const s = getComputedStyle(el);
    return { image: s.backgroundImage, rendering: s.imageRendering, height: el.getBoundingClientRect().height };
  });
  for (const layer of ["hero-land.png", "hero-stars-a.png", "hero-aurora-a.png", "hero-sky.png"]) expect(bg.image).toContain(layer);
  expect(bg.rendering).toBe("pixelated");
  expect(bg.height).toBeGreaterThanOrEqual(360);
  const title = hero(page).getByRole("heading", { level: 1 });
  await expect(title).toHaveText("Under the Aurora");
  expect(await title.evaluate((el) => getComputedStyle(el).fontFamily)).toMatch(/Jersey/i);
  await expect(title).toHaveCSS("text-transform", "none");
});

test("Aurora on a build with a cover keeps the cover, tinted, with no scene over it", async ({ page, context }) => {
  // Iriel belongs to the other test author.
  await signIn(context, "other");
  await pickAndSave(page, IRIEL_BUILD_ID, "Aurora");
  await page.goto(`/b/${IRIEL_BUILD_ID}`);
  await expect(page.locator("[data-theme]").first()).toHaveAttribute("data-theme", "aurora");
  expect(await hero(page).evaluate((el) => getComputedStyle(el).backgroundImage)).not.toContain("hero-land.png");
  expect(await hero(page).locator('[class*="coverImage"]').evaluate((el) => getComputedStyle(el).backgroundImage)).toContain("url(");
  // Back to Ember, so the other tests see the build as seeded.
  await pickAndSave(page, IRIEL_BUILD_ID, "Ember");
});

test("in Ember the build's title isn't in Jersey 10", async ({ page }) => {
  await page.goto(`/b/${IRIEL_BUILD_ID}`);
  await expect(page.locator("[data-theme]").first()).toHaveAttribute("data-theme", "ember");
  const title = hero(page).getByRole("heading", { level: 1 });
  expect(await title.evaluate((el) => getComputedStyle(el).fontFamily)).not.toMatch(/Jersey/i);
  await expect(title).toHaveCSS("text-transform", "uppercase");
});
