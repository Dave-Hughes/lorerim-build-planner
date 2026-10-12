import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";
import { TEST_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1440, height: 900 } });

test("switching deity at level 3 shows in the top bar, the level and search", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${TEST_BUILD_ID}/edit?level=3`);
  const deity = page.getByRole("combobox", { name: "Deity" });
  await deity.selectOption("The Magna-Ge");
  await expect(page.getByText("Saved", { exact: true })).toBeVisible({ timeout: 15_000 });

  await page.goto(`/b/${TEST_BUILD_ID}?level=3`);
  const about = page.getByRole("region", { name: "Character", exact: true });
  await about.getByRole("button", { name: "Deity changes" }).hover();
  await expect(page.getByRole("tooltip").filter({ hasText: "Changes to The Magna-Ge at level 3." })).toBeVisible();
  await expect(page.getByRole("region", { name: "Level 3", exact: true })).toContainText("The Magna-Ge");

  await page.goto("/?q=Magna-Ge");
  await expect(page.getByRole("article").filter({ hasText: "Test Shield-Wall" })).toBeVisible();

  // Put the build back as seeded.
  await page.goto(`/b/${TEST_BUILD_ID}/edit?level=3`);
  await page.getByRole("combobox", { name: "Deity" }).selectOption("");
  await expect(page.getByText("Saved", { exact: true })).toBeVisible({ timeout: 15_000 });
});
