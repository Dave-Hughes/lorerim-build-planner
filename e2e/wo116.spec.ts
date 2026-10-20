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
const reader = (page: Page) => page.getByRole("dialog");
const scrollY = (page: Page) => page.evaluate(() => Math.round(window.scrollY));

test("a build alone has Levels and Guide, no Story tab, and Read the story opens the reader", async ({ page, context }) => {
  await signIn(context);
  // The healer has no guide, so Levels is its only tab and there's no tab row (as before).
  await page.goto(`/b/${HEALER_BUILD_ID}`);
  await expect(page.locator("#level-card")).toBeVisible();
  await expect(page.getByRole("tab", { name: /^(Play|Story)/ })).toHaveCount(0);
  // One with a guide: Levels and Guide.
  await page.goto(`/b/${AZREM_BUILD_ID}`);
  await expect(tabs(page).getByRole("tab")).toHaveText([/^Levels/, /^Guide/]);
  await page.goto(`/b/${HEALER_BUILD_ID}`);
  await page.getByRole("link", { name: "Read the story from the beginning" }).click();
  await expect(page).toHaveURL(new RegExp(`/b/${HEALER_BUILD_ID}/story$`));
  await expect(reader(page).getByRole("heading", { level: 1, name: "The Mender" })).toBeVisible();
  await expect(reader(page).getByText("She came north with a satchel of herbs")).toBeVisible();
  await reader(page).getByRole("link", { name: "‹ Back to the build" }).click();
  await expect(page).toHaveURL(new RegExp(`/b/${HEALER_BUILD_ID}$`));
  await expect(reader(page)).toHaveCount(0);
});

test("a character with a run opens on Play; its build's page opens on Levels; another player sees no Play", async ({ page, context }) => {
  await signIn(context);
  await page.goto(KYRIA);
  await expect(page.getByRole("heading", { level: 1, name: "Kyria Severa" })).toBeVisible();
  await expect(tabs(page).getByRole("tab", { name: /^Play/ })).toHaveAttribute("aria-selected", "true");
  await expect(tabs(page).getByRole("tab")).toHaveCount(3);
  await expect(page.getByRole("heading", { name: "Where you stand" })).toBeVisible();
  await page.goto(`/b/${KYRIA_BUILD_ID}`);
  await expect(tabs(page).getByRole("tab", { name: /^Levels/ })).toHaveAttribute("aria-selected", "true");
  await expect(tabs(page).getByRole("tab", { name: /^Play/ })).toBeVisible();
  // No nested tabs: the old Build tab's address is the Levels tab.
  await page.goto(`${KYRIA}/build`);
  await expect(page).toHaveURL(new RegExp(`${KYRIA}\\?tab=levels$`));
  await expect(tabs(page).getByRole("tab", { name: /^Levels/ })).toHaveAttribute("aria-selected", "true");

  await context.clearCookies();
  await signIn(context, "other");
  await page.goto(`/b/${KYRIA_BUILD_ID}`);
  await expect(page.getByRole("heading", { level: 1, name: "Kyria, Knight of Stendarr" })).toBeVisible();
  await expect(tabs(page).getByRole("tab", { name: /^Play/ })).toHaveCount(0);
});

test("the tab row pins as a thin bar with the name and the tabs, on every tab", async ({ page, context }) => {
  await signIn(context);
  await page.goto(KYRIA);
  const pinned = page.getByRole("region", { name: "Pinned bar" });
  await expect(pinned).toHaveCount(0);
  await page.getByRole("heading", { name: "Objectives" }).scrollIntoViewIfNeeded();
  await expect(pinned.getByText("Kyria Severa")).toBeVisible();
  await expect(pinned.getByRole("button", { name: "Play" })).toHaveAttribute("aria-pressed", "true");
  // A tab picked there opens at its top, the tab row back in view; scrolled down again, the bar is the same.
  await pinned.getByRole("button", { name: "Levels" }).click();
  await expect(tabs(page).getByRole("tab", { name: /^Levels/ })).toHaveAttribute("aria-selected", "true");
  await expect(tabs(page)).toBeInViewport();
  await page.getByRole("region", { name: /^Perks at level/ }).scrollIntoViewIfNeeded();
  await expect(pinned.getByText("Kyria Severa")).toBeVisible();
  await expect(pinned.getByRole("button", { name: "Levels" })).toHaveAttribute("aria-pressed", "true");
});

test("Read Act I opens the reader at its address; Back returns to the same spot, the card now one line", async ({ page, context }) => {
  await signIn(context);
  await page.goto(KYRIA);
  const read = page.getByRole("link", { name: "Read Act I" });
  await expect(page.getByText("1 min | a chapter and 2 entries")).toBeVisible();
  await read.scrollIntoViewIfNeeded();
  const y = await scrollY(page);
  await read.click();
  await expect(page).toHaveURL(new RegExp(`${KYRIA}/story/\\d+$`));
  await expect(reader(page).getByRole("heading", { level: 1, name: "The Sister's House" })).toBeVisible();
  await expect(reader(page).getByText("Act I", { exact: true }).first()).toBeVisible();
  await reader(page).getByRole("link", { name: "‹ Back to the quest log" }).click();
  await expect(page).toHaveURL(new RegExp(`${KYRIA}$`));
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

test("a Story marker opens its entry, and In the game comes back to the row", async ({ page, context }) => {
  await signIn(context);
  await page.goto(KYRIA);
  await page.getByRole("link", { name: /^Story The Mark of Dibella/ }).click();
  await expect(page).toHaveURL(new RegExp(`${KYRIA}/story/\\d+$`));
  await expect(reader(page).getByRole("heading", { level: 1, name: "The Mark of Dibella" })).toBeVisible();
  await expect(reader(page).getByText("From save 7", { exact: true })).toBeVisible();
  await reader(page).getByRole("link", { name: "Warn Haelga, or expose her" }).click();
  await expect(page).toHaveURL(new RegExp(`${KYRIA}\\?act=1#o\\d+$`));
  await expect(reader(page)).toHaveCount(0);
  await expect(page.locator(`#${new URL(page.url()).hash.slice(1)}`)).toBeInViewport();
  // A beat not open yet is a dashed marker, not a link.
  await expect(page.getByText("opens when you tick this")).toBeVisible();
  await expect(page.getByRole("link", { name: /^Story Made with Care/ })).toHaveCount(0);
});

test("previous and next walk the tale in reading order and stop at a waiting beat with Read it anyway", async ({ page, context }) => {
  await signIn(context);
  // The old Tale address opens the reader at the beginning.
  await page.goto(`${KYRIA}/tale`);
  const foot = reader(page).getByRole("navigation", { name: "The story" });
  const titles = ["Chapter One: The Chapel by the Sea", "Chapter Two: The Night of Lanterns", "Chapter Three: The Shield and the Sword", "The Sister's House", "The first set", "The Mark of Dibella", "Made with Care"];
  for (const [i, t] of titles.entries()) {
    await expect(reader(page).getByRole("heading", { level: 1, name: t })).toBeVisible();
    if (i < titles.length - 1) await foot.getByRole("link", { name: `${titles[i + 1]} ›` }).click();
  }
  await expect(reader(page).getByText("Opens when you tick Hunt and tan her first hides.")).toBeVisible();
  await expect(reader(page).getByText("The hide was rough")).toHaveCount(0);
  await reader(page).getByRole("button", { name: "Read it anyway" }).click();
  await expect(reader(page).getByText("The hide was rough under her hands")).toBeVisible();
  await foot.getByRole("link", { name: "‹ The Mark of Dibella" }).click();
  await expect(reader(page).getByRole("heading", { level: 1, name: "The Mark of Dibella" })).toBeVisible();
  // Opened from a link, Back is the page under it.
  await page.keyboard.press("Escape");
  await expect(page).toHaveURL(new RegExp(`${KYRIA}$`));
  await expect(reader(page)).toHaveCount(0);
});

test("the browser's back button closes the reader to the same spot", async ({ page, context }) => {
  await signIn(context);
  await page.goto(KYRIA);
  const marker = page.getByRole("link", { name: /^Story The first set/ });
  await marker.scrollIntoViewIfNeeded();
  const y = await scrollY(page);
  await marker.click();
  await expect(reader(page).getByRole("heading", { level: 1, name: "The first set" })).toBeVisible();
  await page.goBack();
  await expect(reader(page)).toHaveCount(0);
  await expect(page).toHaveURL(new RegExp(`${KYRIA}$`));
  expect(await scrollY(page)).toBe(y);
});

test("ticking the hunt opens Made with Care, read from its marker", async ({ page, context }) => {
  await signIn(context);
  await page.goto(KYRIA);
  const hunt = page.getByRole("checkbox", { name: "Hunt and tan her first hides" });
  await hunt.click();
  const marker = page.getByRole("link", { name: /^Story Made with Care/ });
  await expect(marker).toBeVisible();
  await marker.click();
  await expect(reader(page).getByText("The hide was rough under her hands")).toBeVisible();
  await expect(reader(page).getByText("Read it anyway")).toHaveCount(0);
  await page.keyboard.press("Escape");
  // Back as it was, for the other specs.
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
  await expect(card.getByRole("link", { name: "Start a run ›" })).toHaveAttribute("href", `/b/${FRESH_BUILD_ID}/run`);
  await page.goto(`/b/${FRESH_BUILD_ID}`);
  await page.getByRole("link", { name: "Start a run" }).click();
  await expect(page).toHaveURL(new RegExp(`/b/${FRESH_BUILD_ID}/run$`));
  await expect(page.getByRole("heading", { name: "The run" })).toBeVisible();
});

test("through the door: an act's own chapter, one per act, and the chapters get_playthrough lists", async ({ page, context, baseURL }) => {
  const from = ip();
  await signIn(context);
  const t = await tokenFor(page, context, baseURL!, from);
  const go = (name: string, args: object) => call(baseURL!, from, t.access_token, name, args);
  expect((await go("write_chapter", { playthrough: KYRIA_PLAYTHROUGH_ID, kind: "act", title: "The Bard's Road", text: "The road south." })).text).toMatch(/give `act`/);
  const made = await go("write_chapter", { playthrough: KYRIA_PLAYTHROUGH_ID, kind: "act", act: "2", title: "The Bard's Road", text: "She left Riften at dawn with the lute on her back." });
  expect(made.isError, made.text).toBe(false);
  expect(made.json().link).toMatch(new RegExp(`${KYRIA}/story/\\d+$`));
  const again = await go("write_chapter", { playthrough: KYRIA_PLAYTHROUGH_ID, kind: "act", act: "2", title: "Again", text: "No." });
  expect(again.isError).toBe(true);
  expect(again.text).toContain("This act has its chapter already.");
  const got = (await go("get_playthrough", { playthrough: KYRIA_PLAYTHROUGH_ID })).json();
  expect(got.acts[0].chapter).toMatchObject({ title: "The Sister's House" });
  expect(got.acts[1].chapter).toMatchObject({ title: "The Bard's Road" });
  const haelga = got.acts[0].objectives.find((o: { text: string }) => o.text === "Warn Haelga, or expose her");
  expect(haelga.chapters).toEqual([expect.objectContaining({ title: "The Mark of Dibella", open: true })]);
  const removed = await go("remove_chapter", { playthrough: KYRIA_PLAYTHROUGH_ID, chapter: made.json().chapter });
  expect(removed.isError, removed.text).toBe(false);
});

// WO-116a: one pinned bar, not two: the name, the page's own tabs, and the owner's controls.
for (const [what, path, tabNames, owner] of [
  ["a build alone", `/b/${AZREM_BUILD_ID}`, ["Levels", "Guide"], "other"],
  ["a character", KYRIA, ["Play", "Levels", "Guide"], "author"],
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
    await expect(pinned.getByRole("link", { name: "Set up", exact: true })).toBeVisible();
    await expect(pinned.getByRole("link", { name: "Edit", exact: true })).toHaveAttribute("href", new RegExp("/b/[a-z0-9]{10}/edit$"));
  });
}
