import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";
import { OTHER_BUILD_ID, TEST_BUILD_ID } from "./seed";

test.describe("level-up editor", () => {
  test("only the author gets the editor", async ({ page, context }) => {
    await page.goto(`/b/${TEST_BUILD_ID}/edit`);
    await expect(page).toHaveURL(new RegExp(`/b/${TEST_BUILD_ID}$`));
    await signIn(context);
    await page.goto(`/b/${OTHER_BUILD_ID}/edit`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Nothing here");
    await page.goto(`/b/sample/edit`);
    await expect(page).toHaveURL(/\/b\/sample$/);
  });

  test("adds a level, spends points, takes a perk that just opened, and saves", async ({ page, context }) => {
    await signIn(context);
    await page.goto(`/b/${TEST_BUILD_ID}/edit?level=6`);
    await expect(page.getByText("Editing Test Shield-Wall")).toBeVisible();
    await expect(page.getByText("Level 6 follows every rule. 10 skill points will carry over.")).toBeVisible();

    await page.getByRole("button", { name: "Continue to level 7" }).click();
    await expect(page.getByText("Level up to").locator("..")).toContainText("7");
    await expect(page.getByRole("button", { name: "Continue to level 8" })).toBeVisible();
    await expect(page.getByText("Pick Health, Magicka or Stamina.")).toBeVisible();
    await expect(page.getByText("Includes 10 carried in from level 6")).toBeVisible();

    await page.getByRole("button", { name: /^Health/ }).click();
    await expect(page.getByRole("button", { name: /^Health/ })).toHaveAttribute("aria-pressed", "true");

    // Block 46 -> 50 opens Overpowering Bashes (Block 50).
    const raise = page.getByRole("button", { name: "Raise Block" });
    for (let i = 0; i < 4; i++) await raise.click();
    await expect(page.getByRole("button", { name: "Raise Block" })).toBeEnabled();
    await page.getByRole("tab", { name: /^Block/ }).click();
    await page.getByRole("button", { name: /Overpowering Bashes, Block 50, can take now/ }).click();
    const panel = page.getByRole("complementary", { name: "Perk details" });
    await expect(panel).toContainText("Overpowering Bashes");
    await expect(panel).toContainText("Opened this level: raising Block from 46 to 50 met its requirement.");
    await panel.getByRole("button", { name: "Confirm" }).click();
    await expect(page.getByRole("button", { name: /Overpowering Bashes, Block 50, taken/ })).toBeVisible();
    await expect(panel.getByRole("button", { name: "Remove" })).toBeVisible();
    await expect(page.getByText("Level 7 follows every rule.")).toBeVisible();

    await expect(page.getByText("Saved", { exact: true })).toBeVisible({ timeout: 15_000 });

    // The visitor view shows the saved level.
    await page.goto(`/b/${TEST_BUILD_ID}?level=7`);
    await expect(page.getByText("Changes at level 7")).toBeVisible();
    await expect(page.getByRole("region", { name: "This level and perks" })).toContainText("Overpowering Bashes");
    await expect(page.getByRole("region", { name: "This level and perks" })).toContainText("Block 46 → 50");
    await expect(page.getByText("Planned to level 7")).toBeVisible();
  });

  test("refuses rule breaks and shows why", async ({ page, context }) => {
    await signIn(context);
    await page.goto(`/b/${TEST_BUILD_ID}/edit?level=6`);
    // Level 6 has no perk points left: an open-looking perk is locked for that reason.
    await page.getByRole("tab", { name: /^Heavy Armor/ }).click();
    await page.getByRole("button", { name: /Cushioned/ }).click();
    const panel = page.getByRole("complementary", { name: "Perk details" });
    await expect(panel).toContainText("No perk point to spend at this level.");
    await expect(panel.getByRole("button", { name: "Confirm" })).toHaveCount(0);
    // Skill steppers stop at +5 and at the points available.
    await expect(page.getByRole("button", { name: "Raise One-Handed" })).toBeDisabled();
  });
});
