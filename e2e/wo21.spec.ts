import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";
import { AZREM_BUILD_ID, LONG_BUILD_ID, TEST_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });

test("the card's author line links to their page; a level without a note says so", async ({ page }) => {
  await page.goto(`/b/${AZREM_BUILD_ID}?level=6`);
  const note = page.getByRole("region", { name: "Level 6", exact: true }).getByRole("complementary", { name: "Author's note" });
  await note.getByRole("link", { name: "Someone Else" }).click();
  await expect(page).toHaveURL(/\/u\/e2e-someone-else$/);

  await page.goto(`/b/${LONG_BUILD_ID}?level=10`);
  const empty = page.getByRole("region", { name: "Level 10", exact: true }).getByRole("complementary", { name: "Author's note" });
  await expect(empty).toContainText("No note for level 10.");
  await expect(empty.getByRole("link", { name: "Test Author" })).toBeVisible();
});

test("Banked and Trainer in the card explain themselves on hover", async ({ page }) => {
  // Level 6 of the twenty-level copy: not the last, so Banked (the last level says Unspent, WO-72).
  await page.goto(`/b/${LONG_BUILD_ID}?level=6`);
  await page.getByRole("region", { name: "Level 6", exact: true }).getByText("Banked", { exact: true }).hover();
  await expect(page.getByRole("tooltip").filter({ hasText: "carry over to the next level-up" })).toBeVisible();
  await page.goto(`/b/${AZREM_BUILD_ID}?level=6`);
  await page.getByRole("region", { name: "Level 6", exact: true }).getByText("Trainer", { exact: true }).hover();
  await expect(page.getByRole("tooltip").filter({ hasText: "5 trainer sessions a level" })).toBeVisible();
});

test("on the guide page, focusing a field lights its block in the miniature", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${TEST_BUILD_ID}/guide`);
  const mini = page.getByRole("complementary", { name: "Where it shows" });
  const intro = mini.locator('[data-mini="intro"]');
  const guide = mini.locator('[data-mini="guide"]');
  await expect(intro).toHaveClass(/miniSoft/);
  await expect(guide).toHaveClass(/miniSoft/);
  await page.getByRole("textbox", { name: "Intro" }).click();
  await expect(intro).toHaveClass(/miniOn/);
  await expect(guide).not.toHaveClass(/miniOn/);
  await page.getByRole("textbox", { name: "Guide" }).click();
  await expect(guide).toHaveClass(/miniOn/);
  await expect(intro).not.toHaveClass(/miniOn/);
  await expect(mini.getByRole("link", { name: "See it on the build page" })).toHaveAttribute("href", `/b/${TEST_BUILD_ID}?tab=guide`);
  await expect(mini.getByRole("link", { name: "Level notes" })).toHaveAttribute("href", `/b/${TEST_BUILD_ID}/edit?level=1`);
});

test("the pinned bar steps through levels over the perk tree, and a perk chip selects it in place", async ({ page }) => {
  await page.goto(`/b/${AZREM_BUILD_ID}?level=6`);
  await page.getByRole("region", { name: "Perks at level 6" }).scrollIntoViewIfNeeded();
  const bar = page.getByRole("region", { name: "Pinned bar" });
  const summary = bar.getByLabel(/^What level \d+ changed$/);
  await expect(summary).toHaveAttribute("aria-label", "What level 6 changed");
  await expect(summary.getByRole("button", { name: "Dodge" })).toBeVisible();
  const before = await summary.innerText();

  await bar.getByRole("button", { name: "Next level" }).click();
  await expect(summary).toHaveAttribute("aria-label", "What level 7 changed");
  await expect.poll(() => summary.innerText()).not.toBe(before);

  await bar.getByRole("button", { name: "Previous level" }).click();
  await expect(summary).toHaveAttribute("aria-label", "What level 6 changed");
  const y = await page.evaluate(() => window.scrollY);
  await summary.getByRole("button", { name: "Dodge" }).click();
  const perks = page.getByRole("region", { name: "Perks at level 6" });
  await expect(perks.getByRole("tab", { name: /^Evasion/ })).toHaveAttribute("aria-selected", "true");
  await expect(perks.getByRole("button", { name: /^Dodge, / })).toHaveAttribute("aria-pressed", "true");
  expect(Math.abs((await page.evaluate(() => window.scrollY)) - y)).toBeLessThanOrEqual(2);
});
