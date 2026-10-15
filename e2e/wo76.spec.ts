/**
 * WO-76: free spell picks you can't miss. The counts per level and per build are unit-tested in
 * src/lib/rules/wo76.test.ts.
 */
import { expect, test, type Page } from "@playwright/test";
import { signIn } from "./helpers";
import { HEALER_BUILD_ID, SEVARI_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1512, height: 806 } });

const levelBar = (page: Page) => page.getByRole("region", { name: "Level", exact: true });
const editBar = (page: Page) => page.getByRole("region", { name: "Edit bar" });

test("point 1 and 2: taking Apprentice Restoration says Choose 2 spells, which goes to its picker; the level bar counts them", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${HEALER_BUILD_ID}/edit?level=2`);
  // Restoration, the first major, is the tree that opens.
  await page.locator('[data-perk="Restoration:Apprentice Restoration"]').click();
  await page.getByRole("dialog", { name: "Perk details" }).getByRole("button", { name: "Confirm" }).click();
  const taken = page.getByRole("status").filter({ hasText: "Apprentice Restoration taken." });
  await expect(taken).toBeVisible();
  await expect(levelBar(page).getByRole("button", { name: "2 spells to choose", exact: true })).toBeVisible();
  await taken.getByRole("button", { name: "Choose 2 spells" }).click();
  await expect(page.getByRole("searchbox", { name: "Search Apprentice Restoration spells" })).toBeFocused();
  // Not a problem: the level still follows every rule.
  await expect(page.getByText("Level 2 follows every rule.")).toBeVisible();
});

test("point 2 and 3: a stretch's tier perks share Spells to choose; the edit bar's count and links match; choosing every spell clears them all", async ({ page, context }) => {
  test.setTimeout(120_000);
  await signIn(context);
  await page.goto(`/b/${SEVARI_BUILD_ID}/edit?level=75`);
  const section = page.getByRole("region", { name: "Spells to choose" });
  await expect(section.getByRole("region", { name: /spells$/ })).toHaveCount(3);
  await expect(levelBar(page).getByRole("button", { name: "5 spells to choose", exact: true })).toBeVisible();
  const todo = editBar(page).getByText(/spells to choose: levels/);
  await expect(todo).toHaveText("12 spells to choose: levels 75, 100");
  await expect(page.getByRole("button", { name: /^Levels 51 to 75,.*5 spells to choose/ })).toBeVisible();

  // Level 100 from the edit bar's link, then every pick at both levels.
  for (const at of [75, 100]) {
    if (at === 100) {
      await expect(editBar(page).getByText(/spells to choose/)).toHaveText("7 spells to choose: level 100");
      await editBar(page).getByRole("button", { name: "100", exact: true }).click();
    }
    await expect(levelBar(page)).toContainText(`${at}`);
    const pickers = page.getByRole("region", { name: "Spells to choose" }).getByRole("region", { name: /spells$/ });
    for (const picker of await pickers.all()) {
      while ((await picker.getByRole("button", { name: /^Choose / }).count()) > 0 && !(await picker.getByRole("button", { name: "Change" }).count())) {
        await picker.getByRole("button", { name: /^Choose / }).first().click();
      }
    }
  }
  await expect(editBar(page).getByText(/spells to choose/)).toHaveCount(0);
  await expect(levelBar(page).getByRole("button", { name: /spells to choose/ })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /spells to choose/ })).toHaveCount(0);
});

test("point 4: the build page says nothing about spells to choose", async ({ page }) => {
  await page.goto(`/b/${SEVARI_BUILD_ID}?level=75`);
  await expect(page.getByText(/to choose/)).toHaveCount(0);
});
