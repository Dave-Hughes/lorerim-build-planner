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
  await expect(card.getByText("Add the act's picture")).toBeVisible();
  await card.getByRole("link", { name: "Write it in the Story ›" }).click();
  // Its place in the Story; the chapter is made by its first word (Part 4).
  await expect(page).toHaveURL(new RegExp(`/p/${KYRIA_PLAYTHROUGH_ID}/edit/story/act-\\d+$`));
  await expect(editTab(page, "Story")).toHaveAttribute("aria-current", "page");
  await expect(page.getByLabel("Title")).toHaveValue("The Bard's Road");
});

test("the Story in edit: the act's chapter is made by its first word, a chapter is added from Contents, Preview hides the controls", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/p/${KYRIA_PLAYTHROUGH_ID}/edit/story`);
  await expect(page).toHaveURL(new RegExp(`/edit/story/title$`));
  const contents = page.getByRole("complementary", { name: "Contents" });
  await expect(contents.getByRole("link", { name: "The title page" })).toHaveAttribute("aria-current", "page");
  // Act III has nothing: opening its chapter makes nothing until its first word.
  await contents.getByText("Act III The Winking Skeever").scrollIntoViewIfNeeded();
  const act3 = contents.locator("div").filter({ has: page.getByText("Act III The Winking Skeever", { exact: true }) }).last();
  await act3.getByRole("link", { name: "Write the act's chapter ›" }).click();
  await expect(page).toHaveURL(/\/edit\/story\/act-\d+$/);
  await page.reload();
  await expect(page).toHaveURL(/\/edit\/story\/act-\d+$/);
  await page.getByRole("textbox", { name: "Text" }).click();
  await page.keyboard.type("Solitude had a college for bards and a hall for the dead, and she wanted the first.");
  await savedInBand(page);
  await page.goto(page.url());
  await expect(page).toHaveURL(/\/edit\/story\/\d+$/);
  await expect(page.getByText("Solitude had a college for bards")).toBeVisible();

  // A chapter before Skyrim, from Contents.
  await page.getByRole("button", { name: "+ Add a chapter" }).click();
  await expect(page).toHaveURL(/\/edit\/story\/\d+$/);
  await expect(page.getByLabel("Title")).toHaveValue("A new chapter");
  await expect(contents.getByRole("link", { name: "A new chapter" })).toHaveAttribute("aria-current", "page");

  // Preview: no inputs, no picture slot, no insert row, Contents dimmed.
  await page.getByRole("button", { name: "Preview" }).click();
  await expect(page.getByLabel("Title")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Add a picture" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "+ Image" })).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1, name: "A new chapter" })).toBeVisible();
  await page.getByRole("button", { name: "Write" }).click();
  page.once("dialog", (d) => void d.accept());
  await page.getByRole("button", { name: "Remove this chapter" }).click();
  await expect(page).toHaveURL(/\/edit\/story\/title$/);
});

test("an entry's Opens when changes its objective", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/p/${KYRIA_PLAYTHROUGH_ID}/edit/story`);
  await page.getByRole("complementary", { name: "Contents" }).getByRole("link", { name: /The Mark of Dibella/ }).click();
  const opens = page.getByLabel("Opens when this is done:");
  await expect(opens).toHaveValue(/\d+/);
  const was = await opens.inputValue();
  await opens.selectOption({ label: "Take a room at the Bee and Barb" });
  await savedInBand(page);
  await page.reload();
  await expect(page.getByLabel("Opens when this is done:")).not.toHaveValue(was);
  await page.getByLabel("Opens when this is done:").selectOption(was);
  await savedInBand(page);
});

test("the Pictures panel lists every place a picture can go, and Add uploads into one", async ({ page, context }) => {
  test.setTimeout(90_000);
  await signIn(context);
  await page.goto(`/p/${KYRIA_PLAYTHROUGH_ID}/edit/play?pictures=1`);
  const panel = page.getByRole("dialog", { name: "Pictures" });
  await expect(panel).toBeVisible();
  for (const label of ["The cover", "The title page", "Chapter One: The Chapel by the Sea", "Act I's card", "The Mark of Dibella", "Act V's card"]) await expect(panel.getByText(label, { exact: true })).toBeVisible();
  const before = Number((await page.getByRole("button", { name: /^Pictures \d+ of \d+/ }).textContent())!.match(/Pictures (\d+)/)![1]);
  await panel.getByLabel("Add Act II's card").setInputFiles({ name: "monk.webp", mimeType: "image/webp", buffer: readFileSync("public/traits/monk.webp") });
  await expect(page.getByRole("button", { name: new RegExp(`^Pictures ${before + 1} of`) })).toBeVisible({ timeout: 60_000 });
  await expect(panel.getByLabel("Change Act II's card")).toBeAttached();
  await panel.getByRole("button", { name: "× Close" }).click();
  await expect(panel).toHaveCount(0);
  await page.getByRole("button", { name: /^Pictures/ }).click();
  await page.keyboard.press("Escape");
  await expect(panel).toHaveCount(0);
  // The act's card now shows it.
  await page.goto(`/p/${KYRIA_PLAYTHROUGH_ID}/edit/play`);
  await page.getByRole("link", { name: /The Bard's Road/ }).click();
  await expect(page.getByRole("region", { name: "Act II's card" }).locator("img")).toBeVisible();
});

test("the owner's nudge shows on a coverless draft and not for a reader; the door gives addPictures", async ({ page, context, baseURL, browser }) => {
  const from = ip();
  await signIn(context, "other");
  const t = await tokenFor(page, context, baseURL!, from);
  const go = (name: string, args: object) => call(baseURL!, from, t.access_token, name, args);
  const made = (await go("create_playthrough", { name: "E2E Coverless", line: "Drafted with no pictures.", race: "Nord", birthsign: "Warrior", majors: ["Two-Handed", "Heavy Armor", "Smithing"], minors: ["Block", "Restoration", "Speech"] })).json();
  const done = (await go("finish_draft_playthrough", { playthrough: made.playthrough })).json();
  expect(done.addPictures).toBe(`${baseURL!.replace(/\/$/, "")}/b/${made.build}/setup?step=name&pictures=1`);
  const doneBuild = (await go("finish_draft", { build: made.build })).json();
  expect(doneBuild.addPictures).toBe(`${baseURL!.replace(/\/$/, "")}/b/${made.build}/setup?step=name&pictures=1`);

  await page.goto(`/p/${made.playthrough}`);
  const nudge = page.getByRole("region", { name: "No pictures yet" });
  await expect(nudge).toContainText("Assistants can't add pictures.");
  await expect(nudge).toContainText("Only you see this.");
  await nudge.getByRole("link", { name: "Add pictures" }).click();
  await expect(page).toHaveURL(/\/setup\?step=name&pictures=1$/);
  await expect(page.getByRole("dialog", { name: "Pictures" })).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Pictures" }).getByText("The cover", { exact: true })).toBeVisible();

  // Shared by its link, a reader sees no nudge.
  await page.goto(`/p/${made.playthrough}`);
  const see = page.getByRole("group", { name: "Who can see it" });
  await see.getByRole("button", { name: /^Link only/ }).click();
  await expect(see.getByRole("button", { name: /^Link only/ })).toHaveAttribute("aria-pressed", "true");
  const reader = await browser.newPage();
  // The button shows the choice at once; the page is shared once the save is in.
  await expect.poll(async () => (await reader.goto(`/p/${made.playthrough}`), await reader.getByRole("heading", { level: 1, name: "E2E Coverless" }).count()), { timeout: 15_000 }).toBe(1);
  await expect(reader.getByRole("region", { name: "No pictures yet" })).toHaveCount(0);
  await reader.close();
});

