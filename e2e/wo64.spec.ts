import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";
import { FOUR_BUILD_ID, FRESH_BUILD_ID } from "./seed";

// Running Auto level on a fresh build, and Undo, are WO-65's tests now that goals are picked in the trees.
test.use({ viewport: { width: 1440, height: 900 } });

test("Auto level isn't offered once a build has level 2", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${FOUR_BUILD_ID}/edit?level=4`);
  await expect(page.getByRole("button", { name: /^Continue to level 5/ })).toBeVisible();
  await expect(page.getByRole("button", { name: "Auto level", exact: true })).toHaveCount(0);
});

test.describe("Tapps' card", () => {
  test.use({ storageState: { cookies: [], origins: [] } });
  test("shows on the first visit only, and Show me around brings it back", async ({ page, context }) => {
    await signIn(context);
    await page.goto(`/b/${FRESH_BUILD_ID}/edit`);
    // The author's tour isn't pending here (no build was just made), so the editor opens plainly.
    await page.getByRole("button", { name: "Auto level", exact: true }).click();
    const card = page.getByRole("note").filter({ hasText: "Tapps does the levels" });
    await expect(card).toContainText("Click the perks you want. Tapps brings the ones before them");
    await card.getByRole("button", { name: "Got it" }).click();
    await expect(card).toHaveCount(0);
    await page.getByRole("button", { name: "‹ Level 1" }).click();
    await page.reload();
    await page.getByRole("button", { name: "Auto level", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Auto level" })).toBeVisible();
    await expect(page.getByRole("note").filter({ hasText: "Tapps does the levels" })).toHaveCount(0);
    // Show me around (the account menu: the editor has no site footer) brings him back.
    await page.getByRole("button", { name: /account menu$/ }).click();
    await page.getByRole("menuitem", { name: "Show me around" }).click();
    await expect(page.getByRole("note").filter({ hasText: "Tapps does the levels" })).toBeVisible();
  });
});
