import { expect, test } from "@playwright/test";
import { signIn, editTab } from "./helpers";
import { LINK_ONLY_BUILD_ID, TEST_BUILD_ID } from "./seed";

test.use({ viewport: { width: 1512, height: 806 } });

test("the edit tabs move between Levels and Guide in one step", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${TEST_BUILD_ID}/edit?level=2`);
  await expect(editTab(page, "Build")).toHaveAttribute("aria-current", "page");
  await editTab(page, "Guide").click();
  await expect(page).toHaveURL(new RegExp(`/b/${TEST_BUILD_ID}/guide$`));
  await expect(editTab(page, "Guide")).toHaveAttribute("aria-current", "page");
  await editTab(page, "Build").click();
  await expect(page).toHaveURL(new RegExp(`/b/${TEST_BUILD_ID}/edit$`));
  await expect(page.getByRole("banner")).toBeVisible();
});

test("the visibility button changes Link only to Listed, and Set up's band shows it", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${LINK_ONLY_BUILD_ID}/edit`);
  const bar = page.getByRole("region", { name: "Edit bar" });
  const vis = bar.getByRole("button", { name: "Who can see it: Link only" });
  await vis.click();
  await page.getByRole("menu", { name: "Who can see it" }).getByRole("menuitemradio", { name: /^Listed/ }).click();
  await expect(bar.getByRole("button", { name: "Who can see it: Listed" })).toBeFocused();
  await expect(bar.getByRole("status")).not.toContainText("Saving");
  await editTab(page, "Character").click();
  await expect(page).toHaveURL(new RegExp(`/b/${LINK_ONLY_BUILD_ID}/setup`));
  await page.goto(`/b/${LINK_ONLY_BUILD_ID}/setup?step=name`);
  // Details has no Who can see it of its own (WO-118): the band says it.
  await expect(page.getByLabel("Listed on Characters")).toHaveCount(0);
  // Back to Link only, as seeded.
  await page.getByRole("region", { name: "Edit bar" }).getByRole("button", { name: "Who can see it: Listed" }).click();
  await page.getByRole("menuitemradio", { name: /^Link only/ }).click();
  await expect(page.getByRole("region", { name: "Edit bar" }).getByRole("button", { name: "Who can see it: Link only" })).toBeVisible();
});

// WO-116a: the shared page has no edit bar; the owner's controls are in the hero (and the pinned bar).
test("the owner sees Edit on the shared page, opening the build's editor; a visitor sees none of it", async ({ page, context, browser }) => {
  await signIn(context);
  await page.goto(`/b/${TEST_BUILD_ID}`);
  await expect(page.getByRole("region", { name: "Edit bar" })).toHaveCount(0);
  const hero = page.getByRole("region", { name: "Build" });
  await expect(hero.getByRole("link", { name: "Edit", exact: true })).toHaveAttribute("href", new RegExp(`^/b/${TEST_BUILD_ID}/(edit|play)$`));
  const visitor = await browser.newPage();
  await visitor.goto(`/b/${TEST_BUILD_ID}`);
  await expect(visitor.getByRole("heading", { level: 1 })).toHaveText("Test Shield-Wall");
  await expect(visitor.getByRole("button", { name: /^Who can see it/ })).toHaveCount(0);
  await expect(visitor.getByRole("link", { name: "Set up", exact: true })).toHaveCount(0);
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
