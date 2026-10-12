import { expect, test, type Page } from "@playwright/test";
import { signIn } from "./helpers";
import { IRIEL_BUILD_ID, TEST_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });

const themed = (page: Page) => page.locator("[data-theme]").first();

async function pickAndSave(page: Page, theme: string) {
  await page.goto(`/b/${IRIEL_BUILD_ID}/setup?step=name`);
  const picker = page.getByRole("group", { name: "Theme" });
  const card = picker.getByRole("button", { name: new RegExp(`^${theme}`) });
  await card.click();
  await expect(card).toHaveAttribute("aria-pressed", "true");
  await expect(picker.getByRole("button", { pressed: true })).toHaveCount(1);
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.waitForURL(new RegExp(`/b/${IRIEL_BUILD_ID}/edit`));
}

test("picking Frost and saving shows Iriel's page in Frost", async ({ page, context }) => {
  await signIn(context, "other");
  await pickAndSave(page, "Frost");
  await page.goto(`/b/${IRIEL_BUILD_ID}`);
  await expect(themed(page)).toHaveAttribute("data-theme", "frost");
  await expect(themed(page)).toHaveCSS("background-color", "rgb(15, 26, 36)");
  // Back to Ember, so the other tests see the build as seeded.
  await pickAndSave(page, "Ember");
});

test("an existing build with no theme shows Ember", async ({ page }) => {
  await page.goto(`/b/${TEST_BUILD_ID}`);
  await expect(themed(page)).toHaveAttribute("data-theme", "ember");
  await expect(themed(page)).toHaveCSS("background-color", "rgb(14, 19, 25)");
});

test("the About link is at the foot of the home page, a build page and a profile", async ({ page }) => {
  for (const url of ["/", `/b/${TEST_BUILD_ID}`, "/u/e2e-someone-else"]) {
    await page.goto(url);
    await expect(page.getByRole("contentinfo").getByRole("link", { name: "About" })).toBeVisible();
  }
  await page.getByRole("contentinfo").getByRole("link", { name: "About" }).click();
  await page.waitForURL(/\/about$/);
  const note = page.getByRole("article", { name: "About" });
  await expect(note.getByRole("heading", { level: 1 })).toHaveText("To whoever finds this,");
  await expect(note).toContainText("Mind the frostbite spiders.");
  await expect(note).toContainText("— Tapps, by candlelight");
  await expect(page.locator('meta[property="og:image"]').first()).toHaveAttribute("content", /\/og\/site\.png/);
});
