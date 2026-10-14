import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";
import { LINK_ONLY_BUILD_ID, TEST_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1512, height: 806 } });

test("the edit bar moves between Levels and Guide in one step", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${TEST_BUILD_ID}/edit?level=2`);
  const bar = page.getByRole("region", { name: "Edit bar" });
  await expect(bar.getByRole("link", { name: "Levels" })).toHaveAttribute("aria-current", "page");
  await bar.getByRole("link", { name: "Guide" }).click();
  await expect(page).toHaveURL(new RegExp(`/b/${TEST_BUILD_ID}/guide$`));
  await expect(page.getByRole("region", { name: "Edit bar" }).getByRole("link", { name: "Guide" })).toHaveAttribute("aria-current", "page");
  await page.getByRole("region", { name: "Edit bar" }).getByRole("link", { name: "Levels" }).click();
  await expect(page).toHaveURL(new RegExp(`/b/${TEST_BUILD_ID}/edit$`));
  await expect(page.getByRole("banner")).toBeVisible();
});

test("the visibility button changes Link only to Listed, and Set up shows it", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${LINK_ONLY_BUILD_ID}/edit`);
  const bar = page.getByRole("region", { name: "Edit bar" });
  const vis = bar.getByRole("button", { name: "Who can see it: Link only" });
  await vis.click();
  await page.getByRole("menu", { name: "Who can see it" }).getByRole("menuitemradio", { name: /^Listed/ }).click();
  await expect(bar.getByRole("button", { name: "Who can see it: Listed" })).toBeFocused();
  await expect(bar.getByRole("status")).not.toContainText("Saving");
  await bar.getByRole("link", { name: "Set up" }).click();
  await expect(page).toHaveURL(new RegExp(`/b/${LINK_ONLY_BUILD_ID}/setup`));
  await page.goto(`/b/${LINK_ONLY_BUILD_ID}/setup?step=name`);
  await expect(page.getByLabel("Listed on Browse builds")).toBeChecked();
  // Back to Link only, as seeded.
  await page.getByRole("region", { name: "Edit bar" }).getByRole("button", { name: "Who can see it: Listed" }).click();
  await page.getByRole("menuitemradio", { name: /^Link only/ }).click();
  await expect(page.getByLabel("Anyone with the link")).toBeChecked();
});

test("the owner sees Edit on the shared page; a visitor sees no edit bar", async ({ page, context, browser }) => {
  await signIn(context);
  await page.goto(`/b/${TEST_BUILD_ID}`);
  const bar = page.getByRole("region", { name: "Edit bar" });
  await expect(bar.getByRole("link", { name: "Edit", exact: true })).toBeVisible();
  await expect(bar.getByRole("link", { name: "Levels" })).not.toHaveAttribute("aria-current", "page");
  const visitor = await browser.newPage();
  await visitor.goto(`/b/${TEST_BUILD_ID}`);
  await expect(visitor.getByRole("heading", { level: 1 })).toHaveText("Test Shield-Wall");
  await expect(visitor.getByRole("region", { name: "Edit bar" })).toHaveCount(0);
  await visitor.close();
});

// Since WO-62 the editor has no tree chips: the skill list picks the tree.
test("the editor's tree is at least 520px tall, with no tree chips", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${TEST_BUILD_ID}/edit?level=3`);
  const box = page.locator('[class*="treeBox"]').first();
  await expect(box).toBeVisible();
  expect((await box.boundingBox())!.height).toBeGreaterThanOrEqual(520);
  await expect(page.getByRole("tablist", { name: "Perk trees" })).toHaveCount(0);
  for (const name of ["One-Handed", "Heavy Armor", "Wayfarer", "Enchanting"]) await expect(page.getByRole("button", { name, exact: true })).toBeVisible();
});
