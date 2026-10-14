import { expect, test, type Page } from "@playwright/test";
import { signIn } from "./helpers";
import { REPORTER_TOKENS, TEST_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 1000 } });

const pool = (page: Page, label: string) => page.getByRole("region", { name: "Level", exact: true }).locator("dl > div").filter({ hasText: label });
/** Clicks a star in the open tree and confirms it in its card. */
async function take(page: Page, id: string, too?: string) {
  await page.locator(`[data-perk="${id}"]`).click();
  const card = page.getByRole("complementary", { name: "Perk details" }).first();
  if (too) await expect(card).toContainText(`Takes ${too} too.`);
  await card.getByRole("button", { name: "Confirm" }).click();
}

test("Skip ahead: write 2 to 10 and 11 to 25 as stretches, reset one, and read them on the build page", async ({ page, context }) => {
  test.setTimeout(120_000);
  await context.addCookies([{ name: "authjs.session-token", value: REPORTER_TOKENS[1], domain: "localhost", path: "/" }]);
  await page.goto("/new");
  await page.getByRole("article").filter({ hasText: "Altmer" }).getByRole("button", { name: /^Choose/ }).click();
  await expect(page.getByText("Draft saved")).toBeVisible();
  await page.goto("/new?step=name");
  await page.getByLabel("Build name").fill("Skipping Altmer");
  await page.getByRole("button", { name: "Create build" }).click();
  await page.waitForURL(/\/b\/\w{10}\/edit/);
  const id = page.url().match(/\/b\/(\w{10})\//)![1];
  // Level 1's six perks first (Naaktiid's three extra included), so 2 to 10 starts with nothing carried in.
  const roots = [
    ["Alteration", "Novice Alteration"],
    ["Restoration", "Novice Restoration"],
    ["Illusion", "Novice Illusion"],
    ["Conjuration", "Novice Conjuration"],
    ["Enchanting", "Enchanter's Insight"],
    ["Speech", "Haggling"],
  ];
  for (const [i, [tree, perk]] of roots.entries()) {
    await page.getByRole("button", { name: tree, exact: true }).click();
    await take(page, `${tree}:${perk}`);
    await expect(pool(page, "Perk points")).toContainText(`${5 - i}to spend`);
  }

  // Level 1, then Skip ahead: the target is chosen first (10 levels on, so ‹ once for 10).
  await page.getByRole("button", { name: "Skip ahead to an earlier level" }).click();
  await page.getByRole("button", { name: "Skip ahead to level 10" }).click();
  // The stretches are the level tabs; the open one is pressed.
  const tab = (name: string) => page.getByRole("group", { name: "Levels written" }).getByRole("button", { name });
  await expect(tab("Levels 2 to 10")).toHaveAttribute("aria-pressed", "true");
  await expect(pool(page, "Skill points")).toContainText("270");
  await expect(pool(page, "Skill points")).toContainText("0 of 270 spent, 0 carried in");
  await expect(pool(page, "Perk points")).toContainText("0 of 9 spent");

  // Destruction +20 by typing, 9 attribute level-ups, and Arcane Focus by its star (Novice Destruction comes with it).
  const raise = page.getByLabel("Destruction raise");
  await raise.fill("20");
  await raise.press("Enter");
  await expect(page.getByLabel("Destruction raise")).toHaveValue("+20");
  // Shift-click: 5 at a time; Ctrl or ⌘-click: as far as it can (Alteration to the max skill at level 10, 60).
  await page.getByRole("button", { name: "Raise Restoration" }).click({ modifiers: ["Shift"] });
  await expect(page.getByLabel("Restoration raise")).toHaveValue("+5");
  await page.getByRole("button", { name: "Lower Restoration" }).click({ modifiers: ["Shift"] });
  await expect(page.getByLabel("Restoration raise")).toHaveValue("0");
  await page.getByRole("button", { name: "Raise Alteration" }).click({ modifiers: ["ControlOrMeta"] });
  await expect(page.getByRole("button", { name: "Raise Alteration" })).toBeDisabled();
  await page.getByRole("button", { name: "Lower Alteration" }).click({ modifiers: ["ControlOrMeta"] });
  await expect(page.getByLabel("Alteration raise")).toHaveValue("0");
  for (let i = 0; i < 9; i++) await page.getByRole("button", { name: "More Magicka level-ups" }).click();
  await expect(page.getByText("9 level-ups", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Destruction", exact: true }).click();
  await take(page, "Destruction:Arcane Focus", "Novice Destruction");
  await expect(pool(page, "Perk points")).toContainText("2 of 9 spent");
  await expect(page.getByText("Levels 2 to 10 follow every rule.")).toBeVisible();

  // Skip ahead to 25, Destruction to 50, then Impact: Empowered Destruction comes with it.
  for (let i = 0; i < 5; i++) await page.getByRole("button", { name: "Skip ahead to a later level" }).click();
  await page.getByRole("button", { name: "Skip ahead to level 25" }).click();
  await expect(tab("Levels 11 to 25")).toHaveAttribute("aria-pressed", "true");
  const raise2 = page.getByLabel("Destruction raise");
  await raise2.fill("10");
  await raise2.press("Enter");
  await expect(page.getByLabel("Destruction raise")).toHaveValue("+10");
  await take(page, "Destruction:Impact", "Empowered Destruction");
  await expect(pool(page, "Perk points")).toContainText("2 of 22 spent, 7 carried in");

  // Reset clears the stretch after the confirm.
  await page.getByRole("button", { name: "Reset levels 11 to 25" }).click();
  await page.getByRole("button", { name: "Confirm: reset levels 11 to 25" }).click();
  await expect(pool(page, "Perk points")).toContainText("0 of 22 spent, 7 carried in");
  await expect(page.getByLabel("Destruction raise")).toHaveValue("0");

  // Again, then the build page.
  await page.getByLabel("Destruction raise").fill("10");
  await page.getByLabel("Destruction raise").press("Enter");
  await take(page, "Destruction:Impact", "Empowered Destruction");
  await expect(page.getByText("Saved", { exact: true })).toBeVisible();
  await page.goto(`/b/${id}?level=20`);
  const chips = page.getByRole("group", { name: "Levels written" });
  for (const c of ["1", "2 to 10", "11 to 25"]) await expect(chips.locator(`[data-stretch="${c}"]`)).toBeVisible();
  const card = page.locator("#level-card");
  await expect(card.getByRole("heading", { name: "Levels 11 to 25" })).toBeVisible();
  await expect(card.getByText("Impact").locator("xpath=..")).toContainText("(Destruction 50)");
  await expect(page.getByText("Levels 1, 10, 25", { exact: true })).toBeVisible();
});

test("a build that writes every level looks as it does today", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${TEST_BUILD_ID}/edit?level=2`);
  await expect(page.getByRole("button", { name: /^Level 2/ }).first()).toBeVisible();
  await expect(page.getByRole("group", { name: "Levels written" })).toHaveCount(0);
  await page.goto(`/b/${TEST_BUILD_ID}`);
  await expect(page.getByRole("group", { name: "Levels written" })).toHaveCount(0);
  // No levels line in the byline: the hero says "Planned to level N" as before.
  await expect(page.locator("[class*=byline]")).not.toContainText(/Levels \d/);
  await page.goto("/?version=all");
  await expect(page.getByRole("article").filter({ hasText: "Test Shield-Wall" })).not.toContainText(/Levels \d/);
});
