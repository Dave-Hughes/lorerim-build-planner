/**
 * WO-117: one way to edit. Edit opens Set up at Details; one band, hero and tab row on every edit
 * page (five tabs on a character, three on a build alone); everything saves as it's made, with no
 * Save button; Done goes to Play for a character and Levels for a build alone; the old addresses
 * redirect.
 */
import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { call, editTab, ip, savedInBand, signIn, tokenFor } from "./helpers";
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
  await expect(tabNames(page)).toHaveText([/^Set up/, /^Levels/, /^Guide/, /^Story/, /^Play/]);
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
  await expect(page).toHaveURL(new RegExp(`/p/${KYRIA_PLAYTHROUGH_ID}/edit/story/title$`));
  await expect(editTab(page, "Story")).toHaveAttribute("aria-current", "page");
  const chapter = page.getByRole("complementary", { name: "Contents" }).getByRole("link", { name: /The Mark of Dibella/ });
  const href = (await chapter.getAttribute("href"))!;
  const cid = href.split("/").pop();
  await page.goto(`/p/${KYRIA_PLAYTHROUGH_ID}/edit/tale/${cid}`);
  await expect(page).toHaveURL(new RegExp(`/p/${KYRIA_PLAYTHROUGH_ID}/edit/story/${cid}$`));
  await expect(editTab(page, "Story")).toHaveAttribute("aria-current", "page");
  await page.goto(`/b/${FRESH_BUILD_ID}/story/edit`);
  await expect(page).toHaveURL(new RegExp(`/b/${FRESH_BUILD_ID}/edit/story$`));
});

test("Play in edit: an objective row opens and closes, one at a time, and its buttons are quiet", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/p/${KYRIA_PLAYTHROUGH_ID}/edit/play`);
  await expect(page.getByRole("region", { name: "Act I's card" }).getByRole("textbox", { name: "The act's name" })).toHaveValue("The Sister's House");
  const what = page.getByRole("combobox", { name: "Objective" });
  await expect(what).toHaveCount(0);
  await page.getByRole("button", { name: "Edit Warn Haelga, or expose her" }).click();
  await expect(what).toHaveCount(1);
  await expect(what).toHaveValue("Warn Haelga, or expose her");
  await expect(page.getByRole("group", { name: "Done when" }).getByRole("button", { name: "The save says so" })).toHaveAttribute("aria-pressed", "true");
  // Another opens in its place.
  await page.getByRole("button", { name: "Edit Hunt and tan her first hides" }).click();
  await expect(what).toHaveCount(1);
  await expect(what).toHaveValue("Hunt and tan her first hides");
  await page.getByRole("button", { name: "Close Hunt and tan her first hides" }).click();
  await expect(what).toHaveCount(0);
  await expect(page.locator("main .btn-primary")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "+ Add an objective" })).toBeVisible();
});

test("the act card's Write it in the Story opens that act's chapter", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/p/${KYRIA_PLAYTHROUGH_ID}/edit/play`);
  await page.getByRole("link", { name: /The Bard's Road/ }).click();
  const card = page.getByRole("region", { name: "Act II's card" });
  await expect(card).toContainText("No chapter for this act yet.");
  await expect(card.getByText("Add an image")).toBeVisible();
  await card.getByRole("link", { name: "Write it in the Story ›" }).click();
  // Its place in the Story; the chapter is made by its first word (Part 4).
  await expect(page).toHaveURL(new RegExp(`/p/${KYRIA_PLAYTHROUGH_ID}/edit/story/act-\\d+$`));
  await expect(editTab(page, "Story")).toHaveAttribute("aria-current", "page");
  await expect(page.getByLabel("Title")).toHaveValue("The Bard's Road");
});

test("the Story in edit: a chapter is added in an act from Contents, Preview hides the controls", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/p/${KYRIA_PLAYTHROUGH_ID}/edit/story`);
  await expect(page).toHaveURL(new RegExp(`/edit/story/title$`));
  const contents = page.getByRole("complementary", { name: "Contents" });
  await expect(contents.getByRole("link", { name: "The title page" })).toHaveAttribute("aria-current", "page");
  // Act III has nothing yet: + Add a chapter makes one there (WO-118).
  const act3 = contents.getByRole("group", { name: "Act III The Winking Skeever" });
  await expect(act3.getByText("Nothing written yet.")).toBeVisible();
  await act3.getByRole("button", { name: "+ Add a chapter" }).click();
  await expect(page).toHaveURL(/\/edit\/story\/\d+$/);
  await expect(page.getByLabel("Title")).toHaveValue("A new chapter");
  await expect(act3.getByRole("link", { name: "A new chapter" })).toHaveAttribute("aria-current", "page");
  await page.getByRole("textbox", { name: "Text" }).click();
  await page.keyboard.type("Solitude had a college for bards and a hall for the dead, and she wanted the first.");
  await savedInBand(page);
  await page.reload();
  await expect(page.getByText("Solitude had a college for bards")).toBeVisible();

  // Preview: no inputs, no image slot, no insert row, Contents dimmed.
  await page.getByRole("button", { name: "Preview" }).click();
  await expect(page.getByLabel("Title")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Add an image" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "+ Image" })).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1, name: "A new chapter" })).toBeVisible();
  await page.getByRole("button", { name: "Write" }).click();
  page.once("dialog", (d) => void d.accept());
  await page.getByRole("button", { name: "Remove this chapter" }).click();
  await expect(page).toHaveURL(/\/edit\/story\/title$/);
});

test("a chapter's Unlocks when locks it in Contents until its objective is done", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/p/${KYRIA_PLAYTHROUGH_ID}/edit/story`);
  const contents = page.getByRole("complementary", { name: "Contents" });
  const act4 = contents.getByRole("group", { name: "Act IV The Knight Returns" });
  await act4.getByRole("button", { name: "+ Add a chapter" }).click();
  await expect(page).toHaveURL(/\/edit\/story\/\d+$/);
  const unlocks = page.getByRole("combobox", { name: "Unlocks when" });
  await expect(unlocks).toHaveValue("");
  await unlocks.selectOption({ label: "Reach level 35" });
  await savedInBand(page);
  await page.reload();
  await expect(page.getByRole("combobox", { name: "Unlocks when" })).not.toHaveValue("");
  await expect(act4.getByRole("link", { name: /A new chapter/ })).toContainText("Unlocks when: Reach level 35");
  await expect(act4.getByRole("link", { name: /A new chapter/ }).getByRole("img", { name: "Locked" })).toBeVisible();
  page.once("dialog", (d) => void d.accept());
  await page.getByRole("button", { name: "Remove this chapter" }).click();
  await expect(page).toHaveURL(/\/edit\/story\/title$/);
});

test("Images is on the Story tab only, with no count, and a row stays put when it's filled (WO-118)", async ({ page, context }) => {
  test.setTimeout(90_000);
  await signIn(context);
  await page.goto(`/p/${KYRIA_PLAYTHROUGH_ID}/edit/play`);
  await expect(page.getByRole("button", { name: /^Images/ })).toHaveCount(0);
  await page.goto(`/p/${KYRIA_PLAYTHROUGH_ID}/edit/story/title?images=1`);
  const panel = page.getByRole("dialog", { name: "Images" });
  await expect(panel).toBeVisible();
  await expect(page.getByRole("button", { name: "Images ▾" })).toBeVisible();
  for (const label of ["The title page", "Chapter One: The Chapel by the Sea", "The Mark of Dibella"]) await expect(panel.getByText(label, { exact: true })).toBeVisible();
  // The cover stays in Details, act images on the act cards.
  for (const label of ["The cover", "Act I's card"]) await expect(panel.getByText(label, { exact: true })).toHaveCount(0);
  const rows = () => panel.locator('input[type="file"]').evaluateAll((els) => els.map((e) => e.getAttribute("aria-label")!.replace(/^(Add|Change) /, "")));
  const before = await rows();
  await panel.getByLabel("Add Chapter Two: The Night of Lanterns").setInputFiles({ name: "monk.webp", mimeType: "image/webp", buffer: readFileSync("public/traits/monk.webp") });
  await expect(panel.getByLabel("Change Chapter Two: The Night of Lanterns")).toBeAttached({ timeout: 60_000 });
  expect(await rows()).toEqual(before);
  await panel.getByRole("button", { name: "× Close" }).click();
  await expect(panel).toHaveCount(0);
  await page.getByRole("button", { name: "Images ▾" }).click();
  await page.keyboard.press("Escape");
  await expect(panel).toHaveCount(0);
});

test("a drafted character with no cover asks for one, not for a reader; the connector gives addCover", async ({ page, context, baseURL, browser }) => {
  const from = ip();
  await signIn(context, "other");
  const t = await tokenFor(page, context, baseURL!, from);
  const go = (name: string, args: object) => call(baseURL!, from, t.access_token, name, args);
  const made = (await go("create_playthrough", { name: "E2E Coverless", line: "Drafted with no images.", race: "Nord", birthsign: "Warrior", majors: ["Two-Handed", "Heavy Armor", "Smithing"], minors: ["Block", "Restoration", "Speech"] })).json();
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

