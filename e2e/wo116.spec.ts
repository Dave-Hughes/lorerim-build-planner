/**
 * WO-116: Play is the page; the story opens in a reader. A build alone has Levels and Guide and Read
 * the story; a character with a run opens on Play; the tab row pins; Read Act I opens the reader at
 * its own address and Back returns to the same spot with the card now one line; a Story marker opens
 * its entry and In the game comes back to the row; previous and next walk the tale and stop at a
 * waiting beat; New character is Set up; Start a run from the hero and the card; the browser's back
 * closes the reader; ticking the hunt opens Made with Care; and the door's act chapter.
 */
import { expect, test, type Page } from "@playwright/test";
import { call, ip, signIn, tokenFor } from "./helpers";
import { AZREM_BUILD_ID, FRESH_BUILD_ID, HEALER_BUILD_ID, KYRIA_BUILD_ID, KYRIA_PLAYTHROUGH_ID } from "./seed";

test.describe.configure({ mode: "serial" });
test.use({ viewport: { width: 1440, height: 900 } });

const KYRIA = `/p/${KYRIA_PLAYTHROUGH_ID}`;
const tabs = (page: Page) => page.getByRole("tablist", { name: "Build sections" });
// The reader is a page in the site (WO-124), its way back the bar's "‹ {name}'s playthrough".
const reader = (page: Page) => page.getByRole("region", { name: /^Reading: / });
const backOut = (page: Page) => reader(page).getByRole("link", { name: /^‹ .*'s (playthrough|build)$/ }).click();
const scrollY = (page: Page) => page.evaluate(() => Math.round(window.scrollY));

test("a build alone has Levels and Guide, no Story tab, and Read the story opens the reader", async ({ page, context }) => {
  await signIn(context);
  // The healer has no guide, so Levels is its only tab and there's no tab row (as before).
  await page.goto(`/b/${HEALER_BUILD_ID}`);
  await expect(page.locator("#level-card")).toBeVisible();
  await expect(page.getByRole("tab", { name: /^Story/ })).toHaveCount(0);
  // One with a guide: Levels and Guide.
  await page.goto(`/b/${AZREM_BUILD_ID}`);
  await expect(tabs(page).getByRole("tab")).toHaveText([/^Build/, /^Guide/]);
  await page.goto(`/b/${HEALER_BUILD_ID}`);
  await page.getByRole("link", { name: /^Read the story/ }).first().click();
  await expect(page).toHaveURL(new RegExp(`/b/${HEALER_BUILD_ID}/story$`));
  await expect(reader(page).getByRole("heading", { level: 1, name: "The Mender" })).toBeVisible();
  await expect(reader(page).getByText("She came north with a satchel of herbs")).toBeVisible();
  await backOut(page);
  await expect(page).toHaveURL(new RegExp(`/b/${HEALER_BUILD_ID}$`));
  await expect(reader(page)).toHaveCount(0);
});

test("a character with a run opens on Play, from its build's address too; another player sees it too (a character has one visibility)", async ({ page, context }) => {
  await signIn(context);
  await page.goto(KYRIA);
  await expect(page.getByRole("heading", { level: 1, name: "Kyria, Knight of Stendarr" })).toBeVisible();
  await expect(tabs(page).getByRole("tab", { name: /^Play/ })).toHaveAttribute("aria-selected", "true");
  await expect(tabs(page).getByRole("tab")).toHaveCount(3);
  // Where she is: one line over the act for the owner, with Update (WO-124).
  await expect(page.getByLabel("Where she is")).toContainText(/^Level 6, day 7, Riften\. From Save 7, \d+ \w+\. Update ›$/);
  // A character opens on Play from every way in (WO-117), its build's own address too.
  await page.goto(`/b/${KYRIA_BUILD_ID}`);
  await expect(tabs(page).getByRole("tab", { name: /^Play/ })).toHaveAttribute("aria-selected", "true");
  // The Build tab is the build's own page (WO-164): the old Build address, and ?tab=levels, go there.
  await page.goto(`${KYRIA}/build`);
  await expect(page).toHaveURL(new RegExp(`/b/${KYRIA_BUILD_ID}\\?tab=levels$`));
  await expect(tabs(page).getByRole("tab", { name: /^Build/ })).toHaveAttribute("aria-selected", "true");

  await context.clearCookies();
  await signIn(context, "other");
  await page.goto(`/b/${KYRIA_BUILD_ID}`);
  await expect(page.getByRole("heading", { level: 1, name: "Kyria, Knight of Stendarr" })).toBeVisible();
  // Kyria's character is Link only and her run was seeded Only you: the run follows the character (WO-179 Part 2), so a visitor with the link has Play.
  await expect(tabs(page).getByRole("tab", { name: /^Play/ })).toHaveCount(1);
});

test("the tab row pins as a thin bar with the name and the tabs, on every tab", async ({ page, context }) => {
  await signIn(context);
  await page.goto(KYRIA);
  const pinned = page.getByRole("region", { name: "Pinned bar" });
  await expect(pinned).toHaveCount(0);
  await page.getByRole("heading", { name: "Objectives" }).scrollIntoViewIfNeeded();
  await expect(pinned.getByText("Kyria, Knight of Stendarr")).toBeVisible();
  await expect(pinned.getByRole("button", { name: "Playthrough" })).toHaveAttribute("aria-pressed", "true");
  // A tab picked there opens at its top, the tab row back in view; scrolled down again, the bar is the same.
  await pinned.getByRole("button", { name: "Build" }).click();
  await expect(tabs(page).getByRole("tab", { name: /^Build/ })).toHaveAttribute("aria-selected", "true");
  await expect(tabs(page)).toBeInViewport();
  await page.getByRole("region", { name: /^Perks at level/ }).scrollIntoViewIfNeeded();
  await expect(pinned.getByText("Kyria, Knight of Stendarr")).toBeVisible();
  await expect(pinned.getByRole("button", { name: "Build" })).toHaveAttribute("aria-pressed", "true");
});

test("Read Act I opens the reader at its address; Back returns to the same spot, the card now one line", async ({ page, context }) => {
  await signIn(context);
  await page.goto(KYRIA);
  const read = page.getByRole("link", { name: "Read Act I" });
  await expect(page.getByText("5 chapters")).toBeVisible();
  await read.scrollIntoViewIfNeeded();
  const y = await scrollY(page);
  await read.click();
  await expect(page).toHaveURL(new RegExp(`/b/${KYRIA_BUILD_ID}/story/\\d+$`));
  await expect(reader(page).getByRole("heading", { level: 1, name: "The Sister's House" })).toBeVisible();
  await expect(reader(page).getByText("Act I", { exact: true }).first()).toBeVisible();
  await backOut(page);
  await expect(page).toHaveURL(new RegExp(`/b/${KYRIA_BUILD_ID}\\?tab=playthrough$`));
  await expect(reader(page)).toHaveCount(0);
  expect(await scrollY(page)).toBe(y);
  await expect(page.getByRole("link", { name: "Act I's story ›" })).toBeVisible();
  await expect(read).toHaveCount(0);
  // Kept for the owner: still one line after a reload, and the toggle brings the card back.
  await page.reload();
  await expect(page.getByRole("link", { name: "Act I's story ›" })).toBeVisible();
  await page.getByRole("button", { name: "Show the card" }).click();
  await expect(page.getByRole("link", { name: "Read Act I" })).toBeVisible();
});

test("a Story marker opens its entry, and In the game comes back to the row; a locked chapter is a dashed marker", async ({ page, context }) => {
  await signIn(context);
  await page.goto(KYRIA);
  // Warn Haelga is done, from the save: folded under the list (WO-124).
  await page.getByText(/^✓\d+ done/).click();
  await page.getByRole("link", { name: /^Story The Mark of Dibella/ }).click();
  await expect(page).toHaveURL(new RegExp(`/b/${KYRIA_BUILD_ID}/story/\\d+$`));
  await expect(reader(page).getByRole("heading", { level: 1, name: "The Mark of Dibella" })).toBeVisible();
  await expect(reader(page).getByText("From save 7", { exact: true })).toBeVisible();
  await reader(page).getByRole("link", { name: "Warn Haelga, or expose her" }).click();
  await expect(page).toHaveURL(new RegExp(`/b/${KYRIA_BUILD_ID}\\?tab=playthrough&act=1#o\\d+$`));
  await expect(reader(page)).toHaveCount(0);
  await expect(page.locator(`#${new URL(page.url()).hash.slice(1)}`)).toBeInViewport();
  // WO-124: a chapter tied to an objective stays locked until it's done, an entry too (The first set waits on Speech 40).
  await expect(page.getByText(/^Locked\s*The first set\s*unlocks at Speech 40$/)).toBeVisible();
  await expect(page.getByRole("link", { name: /^Story The first set/ })).toHaveCount(0);
});

test("previous and next walk the tale in reading order and stop at a waiting beat with Read it anyway", async ({ page, context }) => {
  await signIn(context);
  // The old Tale address opens the reader at the beginning.
  await page.goto(`${KYRIA}/tale`);
  const foot = reader(page).getByRole("navigation", { name: "The story" });
  const titles = ["Chapter One: The Chapel by the Sea", "Chapter Two: The Night of Lanterns", "Chapter Three: The Shield and the Sword", "The Sister's House", "The first set", "The Mark of Dibella", "Made with Care"];
  for (const [i, t] of titles.entries()) {
    await expect(reader(page).getByRole("heading", { level: 1, name: t })).toBeVisible();
    if (i < titles.length - 1) await foot.getByRole("link").filter({ hasText: `Next ›${titles[i + 1]}` }).click();
  }
  await expect(reader(page).getByText("This chapter opens when Hunt and tan her first hides is done.")).toBeVisible();
  await expect(reader(page).getByText("The hide was rough")).toHaveCount(0);
  await reader(page).getByRole("button", { name: "Read it anyway" }).click();
  await expect(reader(page).getByText("The hide was rough under her hands")).toBeVisible();
  await foot.getByRole("link").filter({ hasText: "‹ PreviousThe Mark of Dibella" }).click();
  await expect(reader(page).getByRole("heading", { level: 1, name: "The Mark of Dibella" })).toBeVisible();
  // Opened from a link, the way back is the page under it (WO-124: Esc no longer closes anything).
  await page.keyboard.press("Escape");
  await expect(reader(page)).toBeVisible();
  // Each chapter reached is saved as read, and the save refreshes the character's page: let those land before the way back is taken.
  await page.waitForTimeout(1500);
  await backOut(page);
  await expect(page).toHaveURL(new RegExp(`/b/${KYRIA_BUILD_ID}\\?tab=playthrough$`));
  await expect(reader(page)).toHaveCount(0);
});

test("the browser's back button closes the reader to the same spot", async ({ page, context }) => {
  await signIn(context);
  await page.goto(KYRIA);
  await page.getByText(/^✓\d+ done/).click();
  const marker = page.getByRole("link", { name: /^Story The Mark of Dibella/ });
  await marker.scrollIntoViewIfNeeded();
  const y = await scrollY(page);
  await marker.click();
  await expect(reader(page).getByRole("heading", { level: 1, name: "The Mark of Dibella" })).toBeVisible();
  await page.goBack();
  await expect(reader(page)).toHaveCount(0);
  await expect(page).toHaveURL(new RegExp(`/b/${KYRIA_BUILD_ID}\\?tab=playthrough$`));
  expect(await scrollY(page)).toBe(y);
});

test("ticking the hunt opens Made with Care, read from its marker", async ({ page, context }) => {
  await signIn(context);
  await page.goto(KYRIA);
  const hunt = page.getByRole("checkbox", { name: "Hunt and tan her first hides" });
  await hunt.click();
  // Done, it folds away under the list (WO-124): open the fold to see it and its chapter.
  await page.getByText(/^✓\d+ done/).click();
  const marker = page.getByRole("link", { name: /^Story Made with Care/ });
  await expect(marker).toBeVisible();
  await marker.click();
  await expect(reader(page).getByText("The hide was rough under her hands")).toBeVisible();
  await expect(reader(page).getByText("Read it anyway")).toHaveCount(0);
  await backOut(page);
  // Back as it was, for the other specs. The character's page is rendered again on the way back (WO-179), so the fold is shut.
  await page.getByText(/^✓\d+ done/).click();
  await page.getByRole("checkbox", { name: "Hunt and tan her first hides" }).click();
  await expect(page.getByRole("link", { name: /^Story Made with Care/ })).toHaveCount(0);
});

test("New character lands in Set up, with no question first", async ({ page, context }) => {
  await signIn(context);
  await page.goto("/new");
  await expect(page.getByRole("heading", { name: "Choose a race" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "What are you making?" })).toHaveCount(0);
  await expect(page.getByText("The run", { exact: true })).toHaveCount(0);
});

test("Start a run, from the hero and from the card", async ({ page, context }) => {
  await signIn(context);
  await page.goto("/me");
  const card = page.getByRole("article").filter({ has: page.getByRole("link", { name: "Jo'Vashar", exact: true }) });
  await expect(card.getByRole("link", { name: /^Plan a playthrough/ })).toHaveAttribute("href", `/b/${FRESH_BUILD_ID}/run`);
  await page.goto(`/b/${FRESH_BUILD_ID}`);
  await page.getByRole("link", { name: "Plan a playthrough" }).click();
  await expect(page).toHaveURL(new RegExp(`/b/${FRESH_BUILD_ID}/run$`));
  await expect(page.getByRole("heading", { name: "The run" })).toBeVisible();
});

test("through the connector: an act's first chapter opens its card, and the chapters get_playthrough lists", async ({ page, context, baseURL }) => {
  const from = ip();
  await signIn(context);
  const t = await tokenFor(page, context, baseURL!, from);
  const go = (name: string, args: object) => call(baseURL!, from, t.access_token, name, args);
  const made = await go("write_chapter", { playthrough: KYRIA_PLAYTHROUGH_ID, act: "2", title: "The Bard's Road", text: "She left Riften at dawn with the lute on her back." });
  expect(made.isError, made.text).toBe(false);
  expect(made.json().link).toMatch(new RegExp(`/b/${KYRIA_BUILD_ID}/story/\\d+$`));
  // A second chapter in the act is a chapter like any other (WO-118).
  const again = await go("write_chapter", { playthrough: KYRIA_PLAYTHROUGH_ID, act: "2", title: "The Vilemyr Inn", text: "The inn at Ivarstead had one table and no songs." });
  expect(again.isError, again.text).toBe(false);
  const got = (await go("get_playthrough", { playthrough: KYRIA_PLAYTHROUGH_ID })).json();
  expect(got.acts[0].firstChapter).toMatchObject({ title: "The Sister's House" });
  expect(got.acts[1].firstChapter).toMatchObject({ title: "The Bard's Road" });
  expect(got.chapters.find((c: { title: string }) => c.title === "The Vilemyr Inn")).toMatchObject({ act: "2" });
  expect(got.chapters[0]).toMatchObject({ act: "Prologue" });
  const haelga = got.acts[0].objectives.find((o: { text: string }) => o.text === "Warn Haelga, or expose her");
  expect(haelga.chapters).toEqual([expect.objectContaining({ title: "The Mark of Dibella", open: true })]);
  for (const c of [made, again]) {
    const removed = await go("remove_chapter", { playthrough: KYRIA_PLAYTHROUGH_ID, chapter: c.json().chapter });
    expect(removed.isError, removed.text).toBe(false);
  }
});

// WO-116a: one pinned bar, not two: the name, the page's own tabs, and the owner's controls.
for (const [what, path, tabNames, owner] of [
  ["a build alone", `/b/${AZREM_BUILD_ID}`, ["Playthrough", "Build", "Guide"], "other"],
  ["a character", KYRIA, ["Playthrough", "Build", "Guide"], "author"],
] as const) {
  test(`scrolled on ${what}, exactly one bar pins, with its own tabs, no Story tab, and the owner's controls`, async ({ page, context }) => {
    await signIn(context, owner);
    await page.goto(path);
    await expect(page.getByRole("region", { name: "Edit bar" })).toHaveCount(0);
    await page.evaluate(() => window.scrollTo(0, 1600));
    const pinned = page.getByRole("region", { name: "Pinned bar" });
    await expect(pinned).toHaveCount(1);
    // Nothing else is pinned to the top of the window.
    const stuck = await page.evaluate(() => [...document.querySelectorAll("body *")].filter((el) => { const s = getComputedStyle(el); return (s.position === "fixed" || s.position === "sticky") && el.getBoundingClientRect().top <= 1 && el.getBoundingClientRect().height > 20 && el.getBoundingClientRect().bottom > 0; }).length);
    expect(stuck).toBe(1);
    await expect(pinned.getByRole("group", { name: "Sections" }).getByRole("button")).toHaveText([...tabNames]);
    await expect(pinned.getByText(/^Story$/)).toHaveCount(0);
    await expect(pinned.getByRole("button", { name: /^Who can see it/ })).toBeVisible();
    await expect(pinned.getByRole("button", { name: "Copy link" })).toBeVisible();
    await expect(pinned.getByRole("link", { name: "Edit", exact: true })).toHaveAttribute("href", new RegExp("/b/[a-z0-9]{10}/edit(/play)?$"));
  });
}
