/**
 * WO-117: one way to edit. Edit opens Set up at Details; one band, hero and tab row on every edit
 * page (five tabs on a character, three on a build alone); everything saves as it's made, with no
 * Save button; Done goes to Play for a character and Levels for a build alone; the old addresses
 * redirect.
 */
import { expect, test } from "@playwright/test";
import { editTab, savedInBand, signIn } from "./helpers";
import { FRESH_BUILD_ID, KYRIA_BUILD_ID, KYRIA_PLAYTHROUGH_ID } from "./seed";

test.describe.configure({ mode: "serial" });
test.use({ viewport: { width: 1440, height: 900 } });

const tabNames = (page: import("@playwright/test").Page) => page.getByRole("navigation", { name: "Edit tabs" }).getByRole("link");

test("Edit opens Set up at Details, for a character and a build alone", async ({ page, context }) => {
  await signIn(context);
  for (const path of [`/p/${KYRIA_PLAYTHROUGH_ID}`, `/b/${FRESH_BUILD_ID}`]) {
    await page.goto(path);
    await page.getByRole("region", { name: "Build" }).getByRole("link", { name: "Edit", exact: true }).click();
    await expect(page).toHaveURL(/\/setup\?step=name$/);
    await expect(page.getByRole("heading", { level: 1, name: "Details" })).toBeVisible();
    await expect(editTab(page, "Set up")).toHaveAttribute("aria-current", "page");
  }
});

test("five tabs on a character, three on a build alone, and the band's Done is the one ember button", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${KYRIA_BUILD_ID}/setup?step=name`);
  await expect(tabNames(page)).toHaveText([/^Set up/, /^Levels/, /^Play/, /^Guide/, /^Story/]);
  await expect(page.getByRole("region", { name: "Edit bar" })).toContainText("EditingKyria Severa");
  await expect(page.getByRole("link", { name: "Change the cover" })).toHaveAttribute("href", `/b/${KYRIA_BUILD_ID}/setup?step=name#cover`);
  await page.goto(`/b/${FRESH_BUILD_ID}/edit`);
  await expect(tabNames(page)).toHaveText([/^Set up/, /^Levels/, /^Guide/, /^Story/]);
  // Below the site header (its New character is the site's), Done is the one ember button.
  await expect(page.locator(".btn-primary:visible:not(header .btn-primary)")).toHaveCount(1);
  await expect(page.getByRole("region", { name: "Edit bar" }).getByRole("link", { name: "Done" })).toHaveClass(/btn-primary/);
  await expect(page.getByRole("link", { name: "View build" })).toHaveCount(0);
});

test("a change saves as it's made, with no Save button, and is there after a reload", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${FRESH_BUILD_ID}/setup?step=name`);
  await expect(page.getByRole("button", { name: /^Save/ })).toHaveCount(0);
  const description = page.getByLabel("Description");
  const was = await description.inputValue();
  await description.fill("A fresh build, saved as it's typed.");
  await expect(page.getByRole("region", { name: "Edit bar" }).getByRole("status")).toHaveText(/Saving/);
  await savedInBand(page);
  await page.reload();
  await expect(page.getByLabel("Description")).toHaveValue("A fresh build, saved as it's typed.");
  await page.getByLabel("Description").fill(was);
  await savedInBand(page);
});

test("Done goes to Play for a character and Levels for a build alone", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${KYRIA_BUILD_ID}/guide`);
  await page.getByRole("region", { name: "Edit bar" }).getByRole("link", { name: "Done" }).click();
  await expect(page).toHaveURL(new RegExp(`/p/${KYRIA_PLAYTHROUGH_ID}$`));
  await expect(page.getByRole("tablist", { name: "Build sections" }).getByRole("tab", { name: /^Play/ })).toHaveAttribute("aria-selected", "true");
  await page.goto(`/b/${FRESH_BUILD_ID}/guide`);
  await page.getByRole("region", { name: "Edit bar" }).getByRole("link", { name: "Done" }).click();
  await expect(page).toHaveURL(new RegExp(`/b/${FRESH_BUILD_ID}\\?tab=levels$`));
});

test("the old edit addresses go to their tabs", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/p/${KYRIA_PLAYTHROUGH_ID}/edit`);
  await expect(page).toHaveURL(new RegExp(`/p/${KYRIA_PLAYTHROUGH_ID}/edit/play$`));
  await expect(editTab(page, "Play")).toHaveAttribute("aria-current", "page");
  await page.goto(`/p/${KYRIA_PLAYTHROUGH_ID}/edit?tale=1`);
  await expect(page).toHaveURL(new RegExp(`/p/${KYRIA_PLAYTHROUGH_ID}/edit/story$`));
  await expect(editTab(page, "Story")).toHaveAttribute("aria-current", "page");
  const chapter = page.getByRole("link", { name: "Edit" }).first();
  const href = (await chapter.getAttribute("href"))!;
  const cid = href.split("/").pop();
  await page.goto(`/p/${KYRIA_PLAYTHROUGH_ID}/edit/tale/${cid}`);
  await expect(page).toHaveURL(new RegExp(`/p/${KYRIA_PLAYTHROUGH_ID}/edit/story/${cid}$`));
  await expect(editTab(page, "Story")).toHaveAttribute("aria-current", "page");
  await page.goto(`/b/${FRESH_BUILD_ID}/story/edit`);
  await expect(page).toHaveURL(new RegExp(`/b/${FRESH_BUILD_ID}/edit/story$`));
});
