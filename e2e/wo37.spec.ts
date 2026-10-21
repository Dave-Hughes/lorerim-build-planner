import { expect, test, type Page } from "@playwright/test";
import { TEST_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });

const themed = (page: Page) => page.locator("[data-theme]").first();

// The theme picker is off for now (WO-118); every page draws in Ember.
test("an existing build with no theme shows Ember", async ({ page }) => {
  await page.goto(`/b/${TEST_BUILD_ID}`);
  await expect(themed(page)).toHaveAttribute("data-theme", "ember");
  await expect(themed(page)).toHaveCSS("background-color", "rgb(14, 19, 25)");
});
