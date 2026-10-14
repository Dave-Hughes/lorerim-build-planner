import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";
import { FOUR_BUILD_ID, FRESH_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });

test("Auto level on a fresh build: 20 with two targets and three perks, the preview shows them, run makes 20 levels, Undo puts it back", async ({
  page,
  context,
}) => {
  await signIn(context);
  await page.goto(`/b/${FRESH_BUILD_ID}/edit`);
  await page.getByRole("button", { name: "Auto level", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Auto level" })).toBeVisible();
  await expect(
    page.getByRole("spinbutton", { name: "Level to reach" }),
  ).toHaveValue("20");

  // Two targets: keep Two-Handed and Evasion, drop the rest.
  for (const sk of [
    "Alteration",
    "Block",
    "Wayfarer",
    "Smithing",
    "Restoration",
    "Sneak",
    "Speech",
  ])
    await page.getByRole("button", { name: `Remove ${sk}` }).click();
  await page.getByLabel("Two-Handed target").fill("50");
  await page.getByLabel("Evasion target").fill("90");

  const search = page.getByRole("combobox", { name: "Add a perk" });
  for (const name of ["Great Weapon Mastery", "Agility", "Mighty Strike"]) {
    await search.fill(name);
    await page.getByRole("option").filter({ hasText: name }).first().click();
  }
  await search.blur();
  await expect(page.locator("[data-perk-row]")).toHaveCount(3);

  const preview = page.getByRole("complementary", { name: "At level 20" });
  await expect(preview).toContainText("Two-Handed");
  await expect(preview).toContainText("Evasion");
  await expect(
    page.locator('[data-perk-row="Two-Handed:Great Weapon Mastery"]'),
  ).toContainText("Level 2");
  await expect(
    page.locator('[data-perk-row="Two-Handed:Mighty Strike"]'),
  ).toContainText("Not by level 20: needs Two-Handed 100");
  await expect(page.getByText("19 of 19 level-ups")).toBeVisible();

  await page.getByRole("button", { name: "Auto level to 20" }).click();
  await expect(page.getByText("Levels 2 to 20 filled in.")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Previous level" }),
  ).toContainText("19");
  await expect(
    page.getByRole("region", { name: "Problems in this build" }),
  ).toHaveCount(0);
  await expect(page.getByText("Saved", { exact: true })).toBeVisible();

  // Undo: back to the fresh build, level 1 only, and Auto level offered again.
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(page.getByText("Levels 2 to 20 filled in.")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Continue to level 2" }),
  ).toBeVisible();
  await expect(page.getByText("Saved", { exact: true })).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Auto level", exact: true }),
  ).toBeVisible();
});

test("Auto level isn't offered once a build has level 2", async ({
  page,
  context,
}) => {
  await signIn(context);
  await page.goto(`/b/${FOUR_BUILD_ID}/edit?level=4`);
  await expect(
    page.getByRole("button", { name: /^Continue to level 5/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Auto level", exact: true }),
  ).toHaveCount(0);
});

test.describe("Tapps' card", () => {
  test.use({ storageState: { cookies: [], origins: [] } });
  test("shows on the first visit only", async ({ page, context }) => {
    await signIn(context);
    await page.goto(`/b/${FRESH_BUILD_ID}/edit`);
    // The author's tour isn't pending here (no build was just made), so the editor opens plainly.
    await page.getByRole("button", { name: "Auto level", exact: true }).click();
    const card = page
      .getByRole("note")
      .filter({ hasText: "Tapps does the levels" });
    await expect(card).toContainText(
      "Like Mighty Strike at level 30. Not happening.",
    );
    await card.getByRole("button", { name: "Got it" }).click();
    await expect(card).toHaveCount(0);
    await page.getByRole("button", { name: "‹ Level 1" }).click();
    await page.reload();
    await page.getByRole("button", { name: "Auto level", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Auto level" }),
    ).toBeVisible();
    await expect(
      page.getByRole("note").filter({ hasText: "Tapps does the levels" }),
    ).toHaveCount(0);
    // Show me around (the account menu: the editor has no site footer) brings him back.
    await page.getByRole("button", { name: /account menu$/ }).click();
    await page.getByRole("menuitem", { name: "Show me around" }).click();
    await expect(
      page.getByRole("note").filter({ hasText: "Tapps does the levels" }),
    ).toBeVisible();
  });
});
