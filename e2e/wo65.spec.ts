import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";
import { FRESH_MAGE_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 1000 } });

test("goals in the trees: Impact brings its path, the row and preview show it, run fills 20 levels, Undo brings back the fresh build", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${FRESH_MAGE_BUILD_ID}/edit`);
  await page.getByRole("button", { name: "Auto level", exact: true }).click();
  await page.getByRole("button", { name: "Destruction", exact: true }).click();
  await page.locator('[data-perk="Destruction:Impact"]').click();

  // Its path is marked: Impact a goal, Empowered and Novice Destruction coming along.
  await expect(page.locator('[data-perk="Destruction:Impact"]')).toHaveAttribute("data-mark", "goal");
  await expect(page.locator('[data-perk="Destruction:Empowered Destruction"]')).toHaveAttribute("data-mark", "along");
  await expect(page.locator('[data-perk="Destruction:Novice Destruction"]')).toHaveAttribute("data-mark", "along");
  await expect(page.locator('[data-skill="Destruction"] [data-need]')).toHaveText(/^50 by \d+$/);
  const goal = page.locator('[data-goal="Destruction:Impact"]');
  await expect(goal).toContainText("with Novice Destruction, Empowered Destruction");
  await expect(goal).toContainText(/Level \d+/);

  await page.getByRole("button", { name: "Auto level to 20" }).first().click();
  await expect(page.getByText("Levels 2 to 20 filled in.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Previous level" })).toContainText("19");
  await expect(page.getByRole("region", { name: "Problems in this build" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Destruction", exact: true })).toContainText("3");
  await expect(page.getByText("Saved", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(page.getByRole("button", { name: "Continue to level 2" })).toBeVisible();
  await expect(page.getByText("Saved", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("button", { name: "Auto level", exact: true })).toBeVisible();
});

test("a goal that can't make it says so, with the earliest level", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${FRESH_MAGE_BUILD_ID}/edit`);
  await page.getByRole("button", { name: "Auto level", exact: true }).click();
  await page.getByRole("button", { name: "10", exact: true }).click();
  await page.getByRole("button", { name: "Destruction", exact: true }).click();
  await page.locator('[data-perk="Destruction:Expert Destruction"]').click();
  await expect(page.locator('[data-goal="Destruction:Expert Destruction"]')).toContainText(/Not by 10: needs Destruction 75, level \d+ at the earliest/);
  await expect(page.getByRole("button", { name: "Auto level to 10" }).first()).toBeEnabled();
});
