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
    await expect(page.getByRole("region", { name: "Edit bar" }).getByText("Test Shield-Wall")).toBeVisible();
    // Level 6 is the build's last: its points are unspent, not carried (WO-72).
    await expect(page.getByText("Level 6 follows every rule. 10 skill points unspent.")).toBeVisible();

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
    await page.getByRole("button", { name: "Block", exact: true }).click();
    await page.getByRole("button", { name: /Overpowering Bashes, Block 50, can take now/ }).click();
    const panel = page.getByRole("complementary", { name: "Perk details" });
    await expect(panel).toContainText("Overpowering Bashes");
    await expect(panel).toContainText("Opened this level: raising Block from 46 to 50 met its requirement.");
    await panel.getByRole("button", { name: "Confirm" }).click();
    // The card closes on Confirm (WO-31); opening the taken star shows Remove.
    await expect(page.getByRole("complementary", { name: "Perk details" }).filter({ hasText: "Overpowering Bashes" })).toHaveCount(0);
    await page.getByRole("button", { name: /Overpowering Bashes, Block 50, taken/ }).click();
    await expect(panel).toContainText("Taken at level 7");
    await expect(panel.getByRole("button", { name: "Remove" })).toBeVisible();
    await expect(page.getByText("Level 7 follows every rule.")).toBeVisible();

    await expect(page.getByText("Saved", { exact: true })).toBeVisible({ timeout: 15_000 });

    // The visitor view shows the saved level.
    await page.goto(`/b/${TEST_BUILD_ID}?level=7`);
    const card = page.getByRole("region", { name: "Level 7", exact: true });
    await expect(card).toContainText("Overpowering Bashes");
    await expect(card).toContainText("Block+446 → 50");
    await expect(page.getByText("Planned to level 7")).toBeVisible();
  });

  test("refuses rule breaks and shows why", async ({ page, context }) => {
    await signIn(context);
    await page.goto(`/b/${TEST_BUILD_ID}/edit?level=6`);
    // Level 6 has no perk points left: a perk whose requirements are met still shows as can take,
    // and the panel says the point is missing (Confirm waits for one).
    await page.getByRole("button", { name: "One-Handed", exact: true }).click();
    await page.getByRole("button", { name: /^Weapon Mastery, .*can take now/ }).click();
    const panel = page.getByRole("complementary", { name: "Perk details" });
    await expect(panel).toContainText("No perk point to spend at this level.");
    await expect(panel.getByRole("button", { name: "Confirm" })).toBeDisabled();
    // Skill steppers stop at +5 and at the points available.
    await expect(page.getByRole("button", { name: "Raise One-Handed" })).toBeDisabled();
  });
});
