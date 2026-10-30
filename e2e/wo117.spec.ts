/**
 * WO-117: one way to edit. Edit opens Set up at Details; one band, hero and tab row on every edit
 * page (five tabs on a character, three on a build alone); everything saves as it's made, with no
 * Save button; Done goes to Play for a character and Levels for a build alone; the old addresses
 * redirect.
 */
import { expect, test } from "@playwright/test";
import { call, editTab, ip, savedInBand, signIn, tokenFor } from "./helpers";
import { FRESH_BUILD_ID, KYRIA_BUILD_ID, KYRIA_PLAYTHROUGH_ID } from "./seed";

test.describe.configure({ mode: "serial" });
test.use({ viewport: { width: 1440, height: 900 } });

const tabNames = (page: import("@playwright/test").Page) => page.getByRole("navigation", { name: "Edit tabs" }).getByRole("link");

// WO-179: Edit opens the editor of the tab you are on: the playthrough's on a character that has one, the build's on a build alone.
test("Edit opens the editor of the tab open, for a character and a build alone", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/p/${KYRIA_PLAYTHROUGH_ID}`);
  await page.getByRole("region", { name: "Build" }).getByRole("link", { name: "Edit", exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/b/${KYRIA_BUILD_ID}/edit/play$`));
  await expect(editTab(page, "Playthrough")).toHaveAttribute("aria-current", "page");
  await page.goto(`/b/${FRESH_BUILD_ID}`);
  await page.getByRole("region", { name: "Build" }).getByRole("link", { name: "Edit", exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/b/${FRESH_BUILD_ID}/edit$`));
  await expect(editTab(page, "Build")).toHaveAttribute("aria-current", "page");
});

test("four tabs on a character, and the same four on a build with no run yet, and the band's Done is the one ember button", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${KYRIA_BUILD_ID}/setup?step=name`);
  // WO-124: named for what's in them.
  await expect(tabNames(page)).toHaveText(["Playthrough", "Build", "Guide", "Character"]);
  await expect(page.getByRole("region", { name: "Edit bar" })).toContainText("EditingKyria, Knight of Stendarr");
  await expect(page.getByRole("link", { name: "Change the cover" })).toHaveAttribute("href", `/b/${KYRIA_BUILD_ID}/setup?step=name#cover`);
  await page.goto(`/b/${FRESH_BUILD_ID}/edit`);
  // A character with no run yet still shows Playthrough to its owner (WO-159), which opens the page that plans one.
  await expect(tabNames(page)).toHaveText(["Playthrough", "Build", "Guide", "Character"]);
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
  await expect(page).toHaveURL(new RegExp(`/b/${KYRIA_BUILD_ID}\\?tab=playthrough$`));
  await expect(page.getByRole("tablist", { name: "Build sections" }).getByRole("tab", { name: /^Play/ })).toHaveAttribute("aria-selected", "true");
  await page.goto(`/b/${FRESH_BUILD_ID}/guide`);
  await page.getByRole("region", { name: "Edit bar" }).getByRole("link", { name: "Done" }).click();
  await expect(page).toHaveURL(new RegExp(`/b/${FRESH_BUILD_ID}\\?tab=levels$`));
});

test("the old edit addresses go to their tabs", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/p/${KYRIA_PLAYTHROUGH_ID}/edit`);
  await expect(page).toHaveURL(new RegExp(`/b/${KYRIA_BUILD_ID}/edit/play$`));
  await expect(editTab(page, "Playthrough")).toHaveAttribute("aria-current", "page");
  // WO-181: the Story is retired, and its editor's addresses go to the Playthrough tab.
  for (const old of [`/p/${KYRIA_PLAYTHROUGH_ID}/edit?tale=1`, `/p/${KYRIA_PLAYTHROUGH_ID}/edit/story`, `/p/${KYRIA_PLAYTHROUGH_ID}/edit/story/title`, `/p/${KYRIA_PLAYTHROUGH_ID}/edit/tale/1`, `/b/${KYRIA_BUILD_ID}/edit/story`, `/b/${KYRIA_BUILD_ID}/edit/story/title`]) {
    await page.goto(old);
    await expect(page, old).toHaveURL(new RegExp(`/b/${KYRIA_BUILD_ID}/edit/play$`));
  }
  await page.goto(`/b/${FRESH_BUILD_ID}/story/edit`);
  await expect(page).toHaveURL(new RegExp(`/b/${FRESH_BUILD_ID}/edit/play$`));
});

test("Play in edit: an objective row opens and closes, one at a time, and its buttons are quiet", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/p/${KYRIA_PLAYTHROUGH_ID}/edit/play`);
  await expect(page.getByRole("region", { name: "Act I's name" }).getByRole("textbox", { name: "The act's name" })).toHaveValue("The Sister's House");
  const what = page.getByRole("combobox", { name: "Objective" });
  await expect(what).toHaveCount(0);
  await page.getByRole("button", { name: "Edit Warn Haelga, or expose her" }).click();
  await expect(what).toHaveCount(1);
  await expect(what).toHaveValue("Warn Haelga, or expose her");
  // WO-181: no Done when, and no ticking from the save while progress tracking is off.
  await expect(page.getByRole("group", { name: "Done when" })).toHaveCount(0);
  await expect(page.getByRole("switch", { name: /Ticks from your save/ })).toHaveCount(0);
  // Another opens in its place.
  await page.getByRole("button", { name: "Edit Hunt and tan her first hides" }).click();
  await expect(what).toHaveCount(1);
  await expect(what).toHaveValue("Hunt and tan her first hides");
  await page.getByRole("button", { name: "Close Hunt and tan her first hides" }).click();
  await expect(what).toHaveCount(0);
  await expect(page.locator("main .btn-primary")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "+ Add an objective" })).toBeVisible();
});

test("a drafted character with no cover asks for one, not for a reader; the connector gives addCover", async ({ page, context, baseURL, browser }) => {
  const from = ip();
  await signIn(context, "other");
  const t = await tokenFor(page, context, baseURL!, from);
  const go = (name: string, args: object) => call(baseURL!, from, t.access_token, name, args);
  const made = (await go("create_playthrough", { name: "E2E Coverless", line: "Drafted with no images.", race: "Nord", birthsign: "Warrior", majors: ["Two-Handed", "Heavy Armor", "Smithing"], minors: ["Block", "Restoration", "Speech", "One-Handed", "Alchemy", "Wayfarer"], start: "Regular (Inn)", startOption: "Random" })).json();
  const done = (await go("finish_draft_playthrough", { playthrough: made.playthrough })).json();
  expect(done.addCover).toBe(`${baseURL!.replace(/\/$/, "")}/b/${made.build}/setup?step=name#cover`);
  expect(done).not.toHaveProperty("addPictures");
  const doneBuild = (await go("finish_draft", { build: made.build })).json();
  expect(doneBuild.addCover).toBe(`${baseURL!.replace(/\/$/, "")}/b/${made.build}/setup?step=name#cover`);

  await page.goto(`/p/${made.playthrough}`);
  const nudge = page.getByRole("region", { name: "No cover yet" });
  await expect(nudge).toContainText("Assistants can't add images. Add a cover from the planner.");
  await expect(nudge).toContainText("Only you see this.");
  await nudge.getByRole("link", { name: "Add a cover" }).click();
  await expect(page).toHaveURL(/\/setup\?step=name#cover$/);
  await expect(page.getByRole("button", { name: "Add a cover" })).toBeInViewport();

  // Shared by its link, a reader sees no nudge.
  await page.goto(`/p/${made.playthrough}/edit/play`);
  await page.getByRole("button", { name: /^Who can see it/ }).click();
  await page.getByRole("menu", { name: "Who can see it" }).getByRole("menuitemradio", { name: /^Link only/ }).click();
  await expect(page.getByRole("button", { name: "Who can see it: Link only" })).toBeVisible();
  const reader = await browser.newPage();
  // The button shows the choice at once; the page is shared once the save is in.
  await expect.poll(async () => (await reader.goto(`/p/${made.playthrough}`), await reader.getByRole("heading", { level: 1, name: "E2E Coverless" }).count()), { timeout: 15_000 }).toBe(1);
  await expect(reader.getByRole("region", { name: "No cover yet" })).toHaveCount(0);
  await reader.close();
});

test("a failed save shows in the band in red, and Done asks before leaving", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${FRESH_BUILD_ID}/setup?step=name`);
  const description = page.getByLabel("Description");
  await expect(description).toBeVisible();
  // The server can't be reached for this change.
  await page.route(`**/b/${FRESH_BUILD_ID}/setup**`, (route) => (route.request().method() === "POST" ? route.abort() : route.continue()));
  await description.fill("This one won't save.");
  const band = page.getByRole("region", { name: "Edit bar" });
  await expect(band.getByRole("alert")).toContainText("Couldn't reach the server.", { timeout: 15_000 });
  let asked = "";
  page.once("dialog", (d) => {
    asked = d.message();
    void d.dismiss();
  });
  await band.getByRole("link", { name: "Done" }).click();
  await expect.poll(() => asked).toContain("didn't save");
  await expect(page).toHaveURL(/\/setup\?step=name$/);
  await page.unroute(`**/b/${FRESH_BUILD_ID}/setup**`);
});

test("a character opens on Play from every way in: its page, its build's address, and My characters", async ({ page, context }) => {
  await signIn(context);
  const play = () => page.getByRole("tablist", { name: "Build sections" }).getByRole("tab", { name: /^Play/ });
  for (const path of [`/p/${KYRIA_PLAYTHROUGH_ID}`, `/b/${KYRIA_BUILD_ID}`]) {
    await page.goto(path);
    await expect(play()).toHaveAttribute("aria-selected", "true");
  }
  await page.goto("/me");
  await page.getByRole("article").filter({ has: page.getByRole("link", { name: "Kyria, Knight of Stendarr" }) }).getByRole("link", { name: "Kyria, Knight of Stendarr" }).click();
  await expect(play()).toHaveAttribute("aria-selected", "true");
});

