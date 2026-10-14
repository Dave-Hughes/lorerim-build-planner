import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";
import { FOUR_BUILD_ID } from "./seed";

// Running Auto level on a fresh build, and Undo, are WO-65's tests now that goals are picked in the trees;
// Tapps' card became WO-67's tour.
test.use({ viewport: { width: 1440, height: 900 } });

test("Auto level isn't offered once a build has level 2", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${FOUR_BUILD_ID}/edit?level=4`);
  await expect(page.getByRole("button", { name: /^Continue to level 5/ })).toBeVisible();
  await expect(page.getByRole("button", { name: "Auto level", exact: true })).toHaveCount(0);
});
