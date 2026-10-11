import { expect, test } from "@playwright/test";
import { AZREM_BUILD_ID, LONG_BUILD_ID } from "./seed";

// AZREM_BUILD_ID is a copy of Azrem (/b/225en4m79k on staging), from e2e/fixtures/azrem.json.
test.use({ viewport: { width: 1440, height: 900 } });

test("?tab=guide&level=6 opens the Guide tab; Levels then shows level 6 and the address keeps it", async ({ page }) => {
  await page.goto(`/b/${AZREM_BUILD_ID}?tab=guide&level=6`);
  const tabs = page.getByRole("tablist", { name: "Build sections" });
  await expect(tabs.getByRole("tab", { name: "Guide" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toContainText("Javelins only to pull and bait");
  await tabs.getByRole("tab", { name: "Levels" }).click();
  await expect(page.getByRole("heading", { level: 2, name: "Level 6", exact: true })).toBeVisible();
  await expect(page).toHaveURL(/level=6/);
  await expect(page).not.toHaveURL(/tab=/);
  // Arrow keys move between tabs.
  await tabs.getByRole("tab", { name: "Levels" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.getByRole("tab", { name: "Guide" })).toHaveAttribute("aria-selected", "true");
  await expect(page).toHaveURL(/tab=guide/);
});

test("Azrem's level 6 card reads in the order the game asks", async ({ page }) => {
  await page.goto(`/b/${AZREM_BUILD_ID}?level=6`);
  const card = page.getByRole("region", { name: "Level 6", exact: true });
  const keys = await card.locator('[class*="changeKey"]').allTextContents();
  expect(keys).toEqual(["Attribute", "Skill points", "Perk", "Standing stone", "Trainer"]);
  await expect(card).toContainText("The Lover (in place of The Warrior)");
  await expect(card).toContainText("(max skill 56 at level 6)");
  await expect(card).toContainText("Wayfarer +2 (16 → 18)");
  // Biggest gain first; the limit said once.
  await expect(card.getByText(/max skill 56/)).toHaveCount(1);
  await expect(card.getByRole("complementary", { name: "Author's note" })).toBeVisible();
});

test("clicking Dodge in the card selects Evasion and Dodge's star in the Perks section", async ({ page }) => {
  await page.goto(`/b/${AZREM_BUILD_ID}?level=6`);
  await page.getByRole("region", { name: "Level 6", exact: true }).getByRole("button", { name: "Dodge" }).click();
  const perks = page.getByRole("region", { name: "Perks at level 6" });
  await expect(perks.getByRole("tab", { name: /^Evasion/ })).toHaveAttribute("aria-selected", "true");
  await expect(perks.getByRole("button", { name: /^Dodge, / })).toHaveAttribute("aria-pressed", "true");
  await expect(perks).toBeInViewport();
});

test("without an intro the guide's first paragraph shows; without a guide there's no Guide tab", async ({ page }) => {
  await page.goto(`/b/${AZREM_BUILD_ID}`);
  const intro = page.getByRole("region", { name: "Intro" });
  await expect(intro).toContainText("Redguard mercenary who fled a lost battle in Hammerfell");
  await expect(intro).not.toContainText("Javelins only to pull");
  await expect(intro.getByRole("button", { name: "Read the full guide" })).toBeVisible();

  await page.goto(`/b/${LONG_BUILD_ID}`);
  await expect(page.getByRole("region", { name: "Intro" })).toHaveCount(0);
  await expect(page.getByRole("tab", { name: "Guide" })).toHaveCount(0);
  await expect(page.getByRole("tab", { name: "Gear" })).toBeVisible();
});

test("an intro written on the Guide page leads the shared page", async ({ page, context }) => {
  const { signIn } = await import("./helpers");
  const { SCRATCH_BUILD_ID } = await import("./seed");
  await signIn(context);
  await page.goto(`/b/${SCRATCH_BUILD_ID}/guide`);
  const intro = page.getByRole("textbox", { name: "Intro" });
  await intro.click();
  await page.keyboard.type("A shield wall that never moves. ");
  await page.keyboard.press("ControlOrMeta+b");
  await page.keyboard.type("Block first.");
  await expect(page.getByRole("region", { name: "Intro" }).getByText(/\d+ \/ 1,200/)).toHaveText("44 / 1,200");
  // Only Bold, Italic and Link here.
  await expect(page.getByRole("region", { name: "Intro" }).getByRole("toolbar", { name: "Format" }).getByRole("button")).toHaveCount(3);
  await expect(page.getByRole("region", { name: "Intro" }).getByRole("status")).toHaveText("Saved", { timeout: 15_000 });
  await page.goto(`/b/${SCRATCH_BUILD_ID}`);
  const shown = page.getByRole("region", { name: "Intro" });
  await expect(shown).toContainText("A shield wall that never moves. Block first.");
  await expect(shown.locator("strong")).toHaveText("Block first.");
});

test("past the stepper a slim bar pinned to the top keeps stepping through levels", async ({ page }) => {
  await page.goto(`/b/${AZREM_BUILD_ID}?level=6`);
  await expect(page.getByRole("region", { name: "Level, pinned" })).toHaveCount(0);
  await page.getByRole("region", { name: "Perks at level 6" }).scrollIntoViewIfNeeded();
  const bar = page.getByRole("region", { name: "Level, pinned" });
  await expect(bar).toContainText(/Level\s*6\s*of 20/);
  await bar.getByRole("button", { name: "Next level" }).click();
  await expect(bar).toContainText(/Level\s*7\s*of 20/);
  await expect(page.getByRole("region", { name: "Level 7", exact: true })).toBeVisible();
});
