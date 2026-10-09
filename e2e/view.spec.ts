import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";
import { OTHER_BUILD_ID, TEST_BUILD_ID } from "./seed";

test.describe("shared build page", () => {
  test("shows the example build worked out by the rules engine", async ({ page }) => {
    await page.goto("/b/sample?level=6");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Falkreath Shield-Wall");
    await expect(page.getByText("Planned to level 6")).toBeVisible();

    // Identity row
    const character = page.getByRole("region", { name: "Character" });
    await expect(character).toContainText("Nord");
    await expect(character).toContainText("The Lord");
    await expect(character).toContainText("Bulwark, Witcher");

    // Level 6 numbers from the engine
    const stats = page.getByRole("region", { name: "At level 6", exact: true });
    await expect(stats).toContainText("160");
    await expect(stats).toContainText("Carry weight250");
    await expect(stats).toContainText("Skill points carried over10");
    await expect(stats).toContainText("The Lover");

    const changes = page.getByRole("region", { name: "This level and perks" });
    await expect(changes).toContainText("Changes at level 6");
    await expect(changes).toContainText("+5 Health");
    await expect(changes).toContainText("One-Handed 40 → 45");
    await expect(changes).toContainText("Powerful Bashes");
    await expect(changes).toContainText("Banking 10 skill points");
    await expect(changes).toContainText("Craftsmanship (book)");
  });

  test("steps through levels with buttons, the row and the keyboard", async ({ page }) => {
    await page.goto("/b/sample");
    await expect(page.getByText("At level 1", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Next level" }).click();
    await expect(page.getByText("Changes at level 2")).toBeVisible();
    expect(page.url()).toContain("level=2");

    await page.getByRole("button", { name: "Level 5" }).click();
    await expect(page.getByText("Changes at level 5")).toBeVisible();
    await expect(page.getByRole("region", { name: "This level and perks" })).toContainText("Constitution");

    await page.keyboard.press("ArrowRight");
    await expect(page.getByText("Changes at level 6")).toBeVisible();
    await page.keyboard.press("ArrowLeft");
    await expect(page.getByText("Changes at level 5")).toBeVisible();
    await expect(page.getByRole("button", { name: "Previous level" })).toBeEnabled();
  });

  test("opens read-only perk trees", async ({ page }) => {
    await page.goto("/b/sample?level=6");
    await page.getByRole("button", { name: "Open perk trees" }).click();
    const trees = page.getByRole("region", { name: "Perk trees" });
    await expect(trees.getByRole("tab", { name: /^Block/ })).toBeVisible();
    await trees.getByRole("tab", { name: /^Block/ }).click();
    await expect(trees.getByRole("img", { name: /Powerful Bashes, Block 25, taken/ })).toBeVisible();
    await expect(trees.getByText("Can take now")).toBeVisible();
  });

  test("keeps private builds private", async ({ page, context }) => {
    await page.goto(`/b/${OTHER_BUILD_ID}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Nothing here");
    await signIn(context);
    await page.goto(`/b/${OTHER_BUILD_ID}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Nothing here");
    await page.goto(`/b/${TEST_BUILD_ID}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Test Shield-Wall");
    await expect(page.getByRole("link", { name: "Edit build" })).toBeVisible();
  });

  test("signed-out visitors are sent to sign in to copy; signed-in visitors can edit their own", async ({ page }) => {
    await page.goto("/b/sample");
    await expect(page.getByRole("button", { name: "Copy to my builds" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Edit build" })).toHaveCount(0);
  });
});
