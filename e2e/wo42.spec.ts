import { expect, test, type Page } from "@playwright/test";
import { signIn } from "./helpers";
import { SPELLS_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });

/** Opens a tree from the skill list (WO-62), takes the perk named, and confirms it. */
async function takePerk(page: Page, tree: string, perk: string) {
  await page.getByRole("button", { name: tree, exact: true }).click();
  await page.getByRole("button", { name: new RegExp(`^${perk}, No requirement, can take now`) }).click();
  await page.getByRole("complementary", { name: "Perk details" }).getByRole("button", { name: "Confirm" }).click();
}

test("tier perks give spell picks; a spell learned elsewhere, starred, shows on the shared page", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${SPELLS_BUILD_ID}/edit?level=1`);
  await takePerk(page, "Destruction", "Novice Destruction");
  await takePerk(page, "Conjuration", "Novice Conjuration");

  const destruction = page.getByRole("region", { name: "Novice Destruction spells" });
  await expect(destruction).toContainText("Choose 2 spells");
  await expect(destruction).toContainText("0 of 2 chosen");
  await destruction.getByRole("button", { name: "Choose Flames" }).click();
  await destruction.getByRole("button", { name: "Choose Sparks" }).click();
  await expect(destruction).toContainText("2 of 2 chosen");
  // Chosen ones pin to the top; full, the list folds to them, and Change opens it again (WO-73),
  // where the rest can't be chosen past 2.
  await expect(destruction.getByRole("listitem").first()).toContainText("Flames");
  await expect(destruction.getByRole("button", { name: /^Choose / })).toHaveCount(0);
  await destruction.getByRole("button", { name: "Change" }).click();
  await expect(destruction.getByRole("button", { name: "Choose Frostbite" })).toBeDisabled();

  const conjuration = page.getByRole("region", { name: "Novice Conjuration spells" });
  // Search narrows the list.
  await conjuration.getByPlaceholder("Search spells").fill("wolf");
  await expect(conjuration.getByRole("button", { name: /^Choose / })).toHaveCount(1);
  await conjuration.getByRole("button", { name: "Choose Conjure Spirit Wolf" }).click();
  await conjuration.getByPlaceholder("Search spells").fill("");
  await conjuration.getByRole("button", { name: "Choose Bound Sword" }).click();
  await expect(conjuration).toContainText("2 of 2 chosen");

  await expect(page.getByText("✓ Saved", { exact: true })).toBeVisible({ timeout: 15_000 });

  // Level 4: Eldritch Blast, learned from Wuunferth, starred.
  await page.goto(`/b/${SPELLS_BUILD_ID}/edit?level=4`);
  const spells = page.getByRole("region", { name: "Spells", exact: true });
  await spells.getByRole("button", { name: "Add spell" }).click();
  await spells.getByRole("combobox", { name: "Spell" }).fill("Eldritch Bl");
  await spells.getByRole("option", { name: /Eldritch Blast/ }).click();
  await spells.getByLabel("Where (optional)").fill("Wuunferth, Windhelm");
  await spells.getByRole("button", { name: "Add", exact: true }).click();
  await spells.getByRole("button", { name: "Main spell: Eldritch Blast" }).click();
  await expect(spells.getByRole("button", { name: "Main spell: Eldritch Blast" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("✓ Saved", { exact: true })).toBeVisible({ timeout: 15_000 });

  // The shared page.
  await page.goto(`/b/${SPELLS_BUILD_ID}?level=1`);
  const card1 = page.getByRole("region", { name: "Level 1", exact: true });
  await expect(card1).toContainText("New spells");
  for (const name of ["Flames", "Sparks"]) await expect(card1.getByText(name, { exact: true })).toBeVisible();
  await expect(card1.getByText("Conjure Spirit Wolf", { exact: true })).toBeVisible();
  await expect(card1).toContainText("Novice Destruction");

  await page.goto(`/b/${SPELLS_BUILD_ID}?level=4`);
  const card4 = page.getByRole("region", { name: "Level 4", exact: true });
  await expect(card4.getByText("Eldritch Blast", { exact: true })).toBeVisible();
  await expect(card4).toContainText("Wuunferth, Windhelm");
  const section = page.getByRole("region", { name: "Spells and abilities at level 4" });
  await expect(section.getByRole("group", { name: "Main spells" })).toContainText("Eldritch Blast");
  await expect(section.getByRole("group", { name: "Destruction" })).toContainText("Flames");
  // Since WO-52 a main spell isn't a chip as well; the others are, with the level learned.
  await expect(section.getByRole("group", { name: "Destruction" })).toContainText("Lv 1");
  await expect(section.getByRole("group", { name: "Destruction" })).not.toContainText("Eldritch Blast");
  await expect(section.getByRole("group", { name: "Conjuration" })).toBeVisible();

  // Before level 4, Eldritch Blast isn't learned yet.
  await page.goto(`/b/${SPELLS_BUILD_ID}?level=3`);
  await expect(page.getByRole("region", { name: "Spells and abilities at level 3" })).not.toContainText("Eldritch Blast");
});
