/**
 * WO-118, calmer: the story one click away (Read the story and Continue reading beside the tabs, the
 * reader's Contents), and the rest of the order's checks as the parts land.
 */
import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { savedInBand, signIn } from "./helpers";
import { AURORA_BUILD_ID, KYRIA_BUILD_ID, KYRIA_PLAYTHROUGH_ID } from "./seed";

const KYRIA = `/p/${KYRIA_PLAYTHROUGH_ID}`;
// The reader is a page in the site (WO-124).
const reader = (page: Page) => page.getByRole("region", { name: /^Reading: / });
const readTheStory = (page: Page) => page.getByRole("link", { name: /^Read the story/ }).first();

test("Read the story sits at the right of the tab row; the reader's Contents jumps to a chapter; Continue reading names it", async ({ page, context }) => {
  await signIn(context);
  await page.goto(KYRIA);
  // In the tab row, on every tab; the hero's old button is gone.
  await expect(page.getByRole("link", { name: "Read the story from the beginning" })).toHaveCount(0);
  await expect(readTheStory(page)).toBeVisible();
  await page.getByRole("tab", { name: /^Build/ }).click();
  await expect(readTheStory(page)).toBeVisible();
  await readTheStory(page).click();
  await expect(reader(page)).toBeVisible();

  // Contents (WO-124): down the left, every chapter in reading order under its act; the locked ones greyed with "(locked)".
  const contents = reader(page).getByRole("navigation", { name: "Contents" });
  await expect(contents.getByRole("button", { name: /Chapter One: The Chapel by the Sea/ })).toBeVisible();
  await expect(contents.getByText("Act I", { exact: true })).toBeVisible();
  await expect(contents.getByRole("button", { name: "Made with Care (locked)" })).toBeVisible();
  await expect(contents.getByRole("button", { name: "The first set (locked)" })).toBeVisible();
  await contents.getByRole("button", { name: /The Mark of Dibella/ }).click();
  await expect(reader(page).getByRole("heading", { level: 1, name: "The Mark of Dibella" })).toBeVisible();
  await expect(contents.getByRole("button", { name: /The Mark of Dibella/ })).toHaveAttribute("aria-current", "page");
  await expect(page).toHaveURL(new RegExp(`/b/${KYRIA_BUILD_ID}/story/\\d+$`));

  // Esc closes nothing now; the bar's way back does.
  await page.keyboard.press("Escape");
  await expect(reader(page)).toBeVisible();
  await reader(page).getByRole("link", { name: "‹ Kyria, Knight of Stendarr's playthrough" }).click();
  await expect(reader(page)).toHaveCount(0);

  // Continue reading, with the chapter's name, then and after a reload (the owner's readAt).
  await expect(page.getByText("Continue reading").first()).toBeVisible();
  await expect(readTheStory(page)).toHaveAccessibleName("Read the story: continue at The Mark of Dibella");
  await page.reload();
  await expect(readTheStory(page)).toHaveAccessibleName("Read the story: continue at The Mark of Dibella");
  await readTheStory(page).click();
  await expect(reader(page).getByRole("heading", { level: 1, name: "The Mark of Dibella" })).toBeVisible();
});

test("Details holds the six things and nothing else; the cover's Change offers Upload or Use a link", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${KYRIA_BUILD_ID}/setup?step=name`);
  const main = page.getByRole("main");
  for (const label of ["Name", "Description", "Video", "Write-up"]) await expect(main.getByLabel(label, { exact: true })).toBeVisible();
  await expect(main.locator("#cover .label")).toHaveText(/^Cover/);
  await expect(main.getByRole("button", { name: "About tags" })).toBeVisible();
  // Gone: the race row, who can see it, the theme, the second cover preview and the raw link field.
  await expect(main.getByText("LoreRim version")).toHaveCount(0);
  await expect(main.getByText("Build name")).toHaveCount(0);
  await expect(main.getByRole("group", { name: "Who can see it" })).toHaveCount(0);
  await expect(main.getByRole("group", { name: "Theme" })).toHaveCount(0);
  await expect(main.getByText("On the build page")).toHaveCount(0);
  await expect(main.getByText("A link to a screenshot you have already posted")).toHaveCount(0);
  // The cover once, with Change, Position and Remove.
  const cover = main.locator("#cover");
  await expect(cover.locator("img")).toHaveCount(1);
  await cover.getByRole("button", { name: "Change" }).click();
  await page.getByRole("menuitem", { name: "Use a link" }).click();
  await expect(main.getByText("A link to a screenshot you have already posted")).toBeVisible();
  await expect(cover.getByRole("button", { name: "Position" })).toBeVisible();
  await expect(cover.getByRole("button", { name: "Remove" })).toBeVisible();
  // Tags: chips with ×, and + Add a tag opens the full list.
  await main.getByRole("button", { name: "+ Add a tag" }).click();
  await expect(page.getByRole("group", { name: "Tags" })).toBeVisible();
});

test("a build stored with Parchment draws in Ember, and no page offers a theme", async ({ page, context }) => {
  await page.goto(`/b/${AURORA_BUILD_ID}`);
  await expect(page.locator("[data-theme]").first()).toHaveAttribute("data-theme", "ember");
  await expect(page.locator("[data-theme]").first()).toHaveCSS("background-color", "rgb(14, 19, 25)");
  await signIn(context);
  await page.goto(`/b/${AURORA_BUILD_ID}/setup?step=name`);
  await expect(page.getByRole("group", { name: "Theme" })).toHaveCount(0);
  await expect(page.getByText("Parchment theme")).toHaveCount(0);
});

/** The element's box lies wholly inside the window. */
async function onScreen(page: Page, el: import("@playwright/test").Locator) {
  const box = (await el.boundingBox())!;
  const vp = page.viewportSize()!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(vp.width);
  expect(box.y + box.height).toBeLessThanOrEqual(vp.height);
}

for (const [w, h] of [
  [1440, 900],
  [390, 844],
] as const)
  test(`at ${w}: every menu in the hero and the edit band opens fully on screen`, async ({ page, context }) => {
    await page.setViewportSize({ width: w, height: h });
    await signIn(context);
    await page.goto(KYRIA);
    const hero = page.getByRole("region", { name: "Build", exact: true });
    for (const name of [/^Who can see it/, /^More$/]) {
      for (const button of await hero.getByRole("button", { name }).all()) {
        if (!(await button.isVisible())) continue;
        await button.click();
        const menu = page.getByRole("menu");
        await expect(menu).toBeVisible();
        await onScreen(page, menu);
        await page.keyboard.press("Escape");
        await expect(menu).toHaveCount(0);
      }
    }
    await page.goto(`${KYRIA}/edit/play`);
    const band = page.getByRole("region", { name: "Edit bar" });
    // On a phone the bar keeps the tab you're on as a menu, and Done (WO-124); at 1440, who can see it.
    if (w < 900) {
      await band.getByRole("button", { name: /^Playthrough: the edit tabs/ }).click();
      await onScreen(page, page.getByRole("menu", { name: "Edit tabs" }));
    } else {
      await band.getByRole("button", { name: /^Who can see it/ }).click();
      await onScreen(page, page.getByRole("menu", { name: "Who can see it" }));
    }
  });

test("the AI assisted mark is its own tooltip's trigger, with no separate i, in the byline", async ({ page, context }) => {
  await signIn(context);
  // WO-124: the edit page's hero is gone; the mark is in the character page's byline.
  await page.goto(KYRIA);
  await expect(page.getByRole("button", { name: "What AI assisted means" })).toHaveCount(0);
  const mark = page.getByRole("button", { name: "AI assisted" });
  await mark.hover();
  await expect(page.getByRole("tooltip")).toContainText("made this with an AI assistant, like Claude, connected to the planner");
  await mark.blur();
  await page.mouse.move(0, 0);
  await mark.focus();
  await expect(page.getByRole("tooltip")).toBeVisible();
});

test("the owner likes their own private character, with the burst, and unlikes it", async ({ page, context }) => {
  await signIn(context);
  // Kyria's build, made private for the test, then back to Link only.
  const vis = async (to: RegExp) => {
    await page.goto(`/b/${KYRIA_BUILD_ID}/setup?step=name`);
    await page.getByRole("region", { name: "Edit bar" }).getByRole("button", { name: /^Who can see it/ }).click();
    // The save is the page's own POST: wait for it, so the next page doesn't walk away from it.
    const saved = page.waitForResponse((r) => r.request().method() === "POST");
    await page.getByRole("menu", { name: "Who can see it" }).getByRole("menuitemradio", { name: to }).click();
    await saved;
  };
  await vis(/^Only you/);
  await page.goto(KYRIA);
  const hero = page.getByRole("region", { name: "Build", exact: true });
  await hero.getByRole("button", { name: /^Like/ }).click();
  await expect(hero.getByRole("button", { name: /^Liked/ })).toHaveAttribute("aria-busy", "false");
  await expect(hero.locator('[class*="burst"]')).toBeAttached();
  await hero.getByRole("button", { name: /^Liked/ }).click();
  await expect(hero.getByRole("button", { name: /^Like\b/ })).toHaveAttribute("aria-busy", "false");
  await vis(/^Link only/);
});

test("Play is calm: no right rail, Throughout the act, no Add buttons or status menus in the read view", async ({ page, context }) => {
  await signIn(context);
  await page.goto(KYRIA);
  for (const gone of ["Next", "The character", "Keeping it current", "Who can see it"]) await expect(page.getByRole("heading", { name: gone, exact: true })).toHaveCount(0);
  await expect(page.getByText("Throughout the act:")).toBeVisible();
  await expect(page.getByText(/^Standing rule/)).toHaveCount(0);
  for (const add of [/^Add an act/, /^Add an objective/]) await expect(page.getByRole("link", { name: add })).toHaveCount(0);
  await expect(page.getByRole("main").getByRole("combobox")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Enter it by hand" })).toHaveCount(0);
  // The open act shows its levels and place; the others are one line.
  const acts = page.getByRole("complementary").filter({ has: page.getByRole("heading", { name: "Acts" }) });
  await expect(acts.getByText("Levels 1 to 6 | Riften")).toBeVisible();
  await expect(acts.getByText(/Levels 7/)).toHaveCount(0);
});

test("Position on a chapter's image saves where it sits, and the reader shows it there", async ({ page, context }) => {
  test.setTimeout(90_000);
  await signIn(context);
  await page.goto(`${KYRIA}/edit/story`);
  await page.getByRole("complementary", { name: "Contents" }).getByRole("link", { name: "Chapter Three: The Shield and the Sword" }).click();
  await expect(page.getByLabel("Title", { exact: true })).toHaveValue("Chapter Three: The Shield and the Sword");
  await page.getByLabel("The image").setInputFiles({ name: "monk.webp", mimeType: "image/webp", buffer: readFileSync("public/traits/monk.webp") });
  const position = page.getByRole("button", { name: "Position" });
  await expect(position).toBeVisible({ timeout: 60_000 });
  await position.click();
  await expect(page.getByText("Drag the image to place it")).toBeVisible();
  // The arrows nudge it, for the keyboard: three steps left of the middle.
  await page.getByRole("button", { name: "Done" }).press("Shift+ArrowRight");
  await page.getByRole("button", { name: "Done" }).click();
  await savedInBand(page);
  const url = page.url().replace("/edit/story/", "/story/");
  await page.goto(url);
  await expect(reader(page).locator("header img")).toHaveCSS("object-position", "40% 50%");
});

test("the words door, helper, entry, beat, picture and Before Skyrim appear nowhere a player reads", async ({ page, context }) => {
  await signIn(context);
  const banned = /\b(door|helper|entry|entries|beat|beats|picture|pictures|Before Skyrim)\b/i;
  for (const path of [KYRIA, `${KYRIA}?tab=levels`, `${KYRIA}/edit/play`, `${KYRIA}/edit/story/title`, `/b/${KYRIA_BUILD_ID}/setup?step=name`]) {
    await page.goto(path);
    const text = await page.locator("body").innerText();
    // The seed's own words (a chapter's title) aren't the site's.
    expect(text.replace(/The Note Under the Door/g, ""), path).not.toMatch(banned);
  }
  await page.goto(`${KYRIA}/edit/story`);
  await expect(page.getByRole("complementary", { name: "Contents" }).getByRole("group", { name: "Prologue" })).toBeVisible();
});
