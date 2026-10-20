import { expect, test, type Page } from "@playwright/test";
import { signIn, savedInBand } from "./helpers";
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
  // Every change saves as it is made (WO-117).
  await savedInBand(page);
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
