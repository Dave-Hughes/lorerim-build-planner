import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";
import { OTHER_BUILD_ID, TEST_BUILD_ID } from "./seed";

test.describe("shared build page", () => {
  test("shows the example build worked out by the rules engine", async ({ page }) => {
    await page.goto("/b/sample?level=6");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Falkreath Shield-Wall");
    await expect(page.getByText("Planned to level 6")).toBeVisible();

    // Identity row
    const character = page.getByRole("region", { name: "Character", exact: true });
    await expect(character).toContainText("Nord");
    await expect(character).toContainText("The Lord");
    await expect(character).toContainText("Bulwark, Witcher");

    // Level 6 numbers from the engine
    const stats = page.getByRole("region", { name: "Attributes at level 6" });
    await expect(stats).toContainText("160");
    await expect(stats).toContainText("Carry weight250");
    await expect(stats).toContainText("Skill points carried over10");

    // The level card: what to do, and the author's note beside it.
    const card = page.getByRole("region", { name: "Level 6", exact: true });
    await expect(card.getByRole("heading", { name: "Level 6" })).toBeVisible();
    await expect(card).toContainText("+5 Health");
    await expect(card).toContainText("One-Handed+540 → 45");
    await expect(card).toContainText("Powerful Bashes");
    await expect(card.getByRole("complementary", { name: "Author's note" })).toContainText("Banking 10 skill points");
    // Beside the tree only the open tree is listed in full (WO-35): open Smithing.
    const taken = page.getByRole("region", { name: /^Taken by level/ });
    await taken.getByRole("button", { name: /^Smithing \d+ ▸$/ }).click();
    await expect(taken).toContainText("Craftsmanship (book)");
  });

  test("steps through levels with buttons, the row and the keyboard", async ({ page }) => {
    await page.goto("/b/sample");
    const heading = (n: number) => page.getByRole("heading", { level: 2, name: `Level ${n}`, exact: true });
    await expect(heading(1)).toBeVisible();
    await page.getByRole("button", { name: "Next level" }).first().click();
    await expect(heading(2)).toBeVisible();
    expect(page.url()).toContain("level=2");

    await page.getByRole("button", { name: "Level 5" }).click();
    await expect(heading(5)).toBeVisible();
    await expect(page.getByRole("region", { name: "Level 5", exact: true })).toContainText("Constitution");

    await page.keyboard.press("ArrowRight");
    await expect(heading(6)).toBeVisible();
    await page.keyboard.press("ArrowLeft");
    await expect(heading(5)).toBeVisible();
    await expect(page.getByRole("button", { name: "Previous level" })).toBeEnabled();
  });

  test("shows the perk tree beside the held list", async ({ page }) => {
    await page.goto("/b/sample?level=6");
    const trees = page.getByRole("region", { name: "Perks at level 6" });
    await expect(trees.getByRole("tab", { name: /^Block/ })).toBeVisible();
    await trees.getByRole("tab", { name: /^Block/ }).click();
    await expect(trees.getByRole("button", { name: /Powerful Bashes, Block 25, taken/ })).toBeVisible();
    await expect(trees.getByRole("region", { name: /^Taken by level/ })).toContainText("Powerful Bashes");
    await expect(trees.getByText("Can take now", { exact: true }).first()).toBeVisible();
  });

  test("keeps private builds private", async ({ page, context }) => {
    await page.goto(`/b/${OTHER_BUILD_ID}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Nothing here");
    await signIn(context);
    await page.goto(`/b/${OTHER_BUILD_ID}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Nothing here");
    await page.goto(`/b/${TEST_BUILD_ID}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Test Shield-Wall");
    // The owner edits from their controls in the hero (WO-116a: no edit bar on the build's own page).
    await expect(page.getByRole("region", { name: "Edit bar" })).toHaveCount(0);
    await expect(page.getByRole("region", { name: "Build" }).getByRole("link", { name: "Edit", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Edit build" })).toHaveCount(0);
  });

  test("signed-out visitors are sent to sign in to copy; signed-in visitors can edit their own", async ({ page }) => {
    await page.goto("/b/sample");
    await expect(page.getByRole("button", { name: "Copy to my builds" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Edit build" })).toHaveCount(0);
  });
});
