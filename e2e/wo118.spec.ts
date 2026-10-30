/**
 * WO-118, calmer: the story one click away (Read the story and Continue reading beside the tabs, the
 * reader's Contents), and the rest of the order's checks as the parts land.
 */
import { expect, test, type Page } from "@playwright/test";
import { signIn } from "./helpers";
import { AURORA_BUILD_ID, KYRIA_BUILD_ID, KYRIA_PLAYTHROUGH_ID } from "./seed";

const KYRIA = `/p/${KYRIA_PLAYTHROUGH_ID}`;

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
  await page.goto(`${KYRIA}?act=1`);
  await expect(page.getByText("Throughout the act:")).toBeVisible();
  await expect(page.getByText(/^Standing rule/)).toHaveCount(0);
  for (const add of [/^Add an act/, /^Add an objective/]) await expect(page.getByRole("link", { name: add })).toHaveCount(0);
  await expect(page.getByRole("main").getByRole("combobox")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Enter it by hand" })).toHaveCount(0);
  // Every act's levels and place, one line each (WO-181).
  const acts = page.getByRole("complementary").filter({ has: page.getByRole("heading", { name: "Acts" }) });
  await expect(acts.getByText("Levels 1 to 6 | Riften")).toBeVisible();
});

test("the words door, helper, entry, beat, picture and Before Skyrim appear nowhere a player reads", async ({ page, context }) => {
  await signIn(context);
  const banned = /\b(door|helper|entry|entries|beat|beats|picture|pictures|Before Skyrim)\b/i;
  for (const path of [KYRIA, `${KYRIA}?tab=levels`, `${KYRIA}/edit/play`, `/b/${KYRIA_BUILD_ID}/setup?step=name`]) {
    await page.goto(path);
    const text = await page.locator("body").innerText();
    // The seed's own words (a chapter's title) aren't the site's.
    expect(text.replace(/The Note Under the Door/g, ""), path).not.toMatch(banned);
  }
});
