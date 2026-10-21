import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";
import { PURE_MAGE_BUILD_ID, REPORTER_TOKENS } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });

test("a build through all 7 steps: Mephala on the Deity step saves, and the rail shows every step done", async ({ page, context }) => {
  // One of WO-40's reporters: by now the test author is at the day's build limit.
  await context.addCookies([{ name: "authjs.session-token", value: REPORTER_TOKENS[0], domain: "localhost", path: "/" }]);
  await page.goto("/new");
  const rail = page.getByRole("complementary", { name: "Setup steps" });
  await expect(rail.getByRole("button", { name: /^Race: this step/ })).toBeVisible();
  await expect(rail.getByRole("button", { name: /^Birthsign: not started/ })).toBeVisible();

  await page.getByRole("article").filter({ hasText: "Breton" }).getByRole("button", { name: /^Choose/ }).click();
  await page.getByRole("button", { name: "Next: Birthsign" }).click();
  await page.getByRole("article").filter({ hasText: "The Mage" }).getByRole("button", { name: "Choose" }).click();
  await page.getByRole("button", { name: "Next: Skills" }).click();
  for (const s of ["Conjuration", "Illusion", "Alteration"]) await page.getByRole("group", { name: s }).getByRole("button", { name: "Major" }).click();
  for (const s of ["Restoration", "Enchanting", "Alchemy"]) await page.getByRole("group", { name: s }).getByRole("button", { name: "Minor" }).click();
  // Part way, the step shows its problem.
  await expect(rail.getByRole("button", { name: "Skills: Choose 3 more minors" })).toHaveCount(0);
  await page.getByRole("button", { name: "Next: Traits" }).click();
  await expect(rail.getByRole("button", { name: "Skills: Choose 3 more minors" })).toBeVisible();
  await rail.getByRole("button", { name: /^Skills/ }).click();
  for (const s of ["Destruction", "Speech", "Sneak"]) await page.getByRole("group", { name: s }).getByRole("button", { name: "Minor" }).click();
  await page.getByRole("button", { name: "Next: Traits" }).click();
  await page.getByRole("button", { name: "Skip traits" }).click();

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Choose a deity");
  await page.getByRole("button", { name: "Mephala", exact: true }).click();
  await expect(page.getByRole("button", { name: "Mephala", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("region", { name: "The chosen god" })).toContainText("Mephala");
  await page.getByRole("button", { name: "Next: Mode and start" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Game mode and start");
  await page.getByLabel("Out in the Wilderness").check();
  await page.getByLabel("Hold").selectOption("Falkreath");
  await page.getByRole("button", { name: "Next: Details" }).click();
  await page.getByLabel("Name", { exact: true }).fill("Seven Steps");

  for (const s of ["Race", "Birthsign", "Skills", "Traits", "Deity", "Mode and start"]) await expect(rail.getByRole("button", { name: `${s}: done` })).toBeVisible();
  await page.getByRole("button", { name: "Create character" }).click();
  await page.waitForURL(/\/b\/([23456789abcdefghjkmnpqrstuvwxyz]{10})\/edit/);
  const id = page.url().match(/\/b\/(\w{10})\//)![1];
  await page.goto(`/b/${id}/setup?step=deity`);
  await expect(page.getByRole("button", { name: "Mephala", exact: true })).toHaveAttribute("aria-pressed", "true");
  for (const s of ["Race", "Birthsign", "Skills", "Traits", "Mode and start", "Details"]) await expect(rail.getByRole("button", { name: `${s}: done` })).toBeVisible();
});

test("an existing build opens on the Deity step with its god chosen; ?step=mode opens Mode and start", async ({ page, context }) => {
  await signIn(context, "other");
  await page.goto(`/b/${PURE_MAGE_BUILD_ID}/setup?step=deity`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Choose a deity");
  await expect(page.getByRole("button", { name: "Syrabane", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.goto(`/b/${PURE_MAGE_BUILD_ID}/setup?step=mode`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Game mode and start");
});
