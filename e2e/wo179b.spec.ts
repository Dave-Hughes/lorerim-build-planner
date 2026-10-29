/**
 * WO-179 Part 2 (Bob's signed-in walk): the playthrough's editor is under its character, a character has one visibility, what to do offers quests,
 * places and people and its list closes, the Quest field follows the pick, What next keeps Details ticked and speaks in the character's pronoun,
 * and a character with no cover shows its race's icon or the planner's mark.
 */
import { expect, test } from "@playwright/test";
import { call, editTab, ip, signIn, tokenFor } from "./helpers";
import { KYRIA_BUILD_ID, KYRIA_PLAYTHROUGH_ID } from "./seed";

/** One character made through the door for the file (a player may hold only so many drafts): an act in it, no race, no cover. */
let made: { pt: string; buildId: string } | null = null;
async function shell(page: import("@playwright/test").Page, context: import("@playwright/test").BrowserContext, baseURL: string, name: string) {
  if (made) return made;
  const from = ip();
  const token = (await tokenFor(page, context, baseURL, from)).access_token;
  const go = (n: string, args: object) => call(baseURL, from, token, n, args);
  const created = await go("create_playthrough", { name });
  expect(created.isError, created.text).toBe(false);
  const pt = created.json().playthrough as string;
  await go("add_act", { playthrough: pt, name: "The Sister's House", levels: "1 to 5", place: "Riften", goal: "A bed." });
  await page.goto(`/p/${pt}`);
  await page.waitForURL(/\/b\/[^/]+\?tab=playthrough/);
  made = { pt, buildId: /\/b\/([^/?]+)/.exec(page.url())![1] };
  return made;
}

test("the playthrough's editor is under its character: every old address lands there, and the tabs keep to /b/", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/p/${KYRIA_PLAYTHROUGH_ID}/edit/play`);
  await expect(page).toHaveURL(new RegExp(`/b/${KYRIA_BUILD_ID}/edit/play$`));
  for (const name of ["Playthrough", "Build", "Guide", "Character", "Story"]) await expect(editTab(page, name)).toHaveAttribute("href", new RegExp(`^/b/${KYRIA_BUILD_ID}/`));
  await expect(editTab(page, "Playthrough")).toHaveAttribute("href", `/b/${KYRIA_BUILD_ID}/edit/play`);
  await expect(editTab(page, "Story")).toHaveAttribute("href", `/b/${KYRIA_BUILD_ID}/edit/story/title`);
  await editTab(page, "Story").click();
  await expect(page).toHaveURL(new RegExp(`/b/${KYRIA_BUILD_ID}/edit/story/title$`));
  await editTab(page, "Playthrough").click();
  await expect(page).toHaveURL(new RegExp(`/b/${KYRIA_BUILD_ID}/edit/play$`));
  // The old addresses, and the character page's own way of naming the tab.
  const lands = new Map([
    [`/p/${KYRIA_PLAYTHROUGH_ID}/edit`, `/b/${KYRIA_BUILD_ID}/edit/play`],
    [`/p/${KYRIA_PLAYTHROUGH_ID}/edit?tale=1`, `/b/${KYRIA_BUILD_ID}/edit/story/title`],
    [`/p/${KYRIA_PLAYTHROUGH_ID}/edit/story`, `/b/${KYRIA_BUILD_ID}/edit/story/title`],
    [`/p/${KYRIA_PLAYTHROUGH_ID}/edit/story/title`, `/b/${KYRIA_BUILD_ID}/edit/story/title`],
    [`/b/${KYRIA_BUILD_ID}/edit?tab=playthrough`, `/b/${KYRIA_BUILD_ID}/edit/play`],
    [`/b/${KYRIA_BUILD_ID}/play`, `/b/${KYRIA_BUILD_ID}/edit/play`],
  ]);
  for (const [from, to] of lands) {
    await page.goto(from);
    await expect(page, from).toHaveURL(new RegExp(`${to.replace(/[?]/g, "\\?")}$`));
  }
  // A chapter's page, the link in the Story tab, stays under the character.
  await page.goto(`/b/${KYRIA_BUILD_ID}/edit/story/title`);
  const first = page.getByRole("complementary", { name: "Contents" }).getByRole("link").nth(1);
  await expect(first).toHaveAttribute("href", new RegExp(`^/b/${KYRIA_BUILD_ID}/edit/story/`));
  // Someone who isn't the owner is sent to the character's page.
  await context.clearCookies();
  await page.goto(`/b/${KYRIA_BUILD_ID}/edit/play`);
  await expect(page).toHaveURL(new RegExp(`/b/${KYRIA_BUILD_ID}$`));
});

test("a character has one visibility: set from the playthrough's editor, the character's page and its Playthrough tab follow", async ({ page, context, baseURL }) => {
  await signIn(context);
  const { pt, buildId } = await shell(page, context, baseURL!, "E2E One Visibility");
  // Private to start: a visitor finds nothing.
  await page.goto(`/b/${buildId}/edit/play`);
  const menu = page.getByRole("region", { name: "Edit bar" }).getByRole("button", { name: /^Who can see it/ });
  await expect(menu).toContainText("Only you");
  await menu.click();
  const saved = page.waitForResponse((r) => r.request().method() === "POST");
  await page.getByRole("menu", { name: "Who can see it" }).getByRole("menuitemradio", { name: /^Link only/ }).click();
  await expect(menu).toContainText("Link only");
  await saved;
  // The character's own editor says the same, and so does a reload of the playthrough's.
  await page.goto(`/b/${buildId}/edit`);
  await expect(page.getByRole("region", { name: "Edit bar" }).getByRole("button", { name: /^Who can see it/ })).toContainText("Link only");
  await page.goto(`/b/${buildId}/edit/play`);
  await expect(page.getByRole("region", { name: "Edit bar" }).getByRole("button", { name: /^Who can see it/ })).toContainText("Link only");
  // A visitor with the link sees the character and its playthrough (a character with only that has no tab row).
  await context.clearCookies();
  await page.goto(`/b/${buildId}`);
  await expect(page.getByRole("heading", { level: 1, name: "E2E One Visibility" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Act I The Sister's House" })).toBeVisible();
  await page.goto(`/p/${pt}`);
  await expect(page).toHaveURL(new RegExp(`/b/${buildId}\\?tab=playthrough`));
  // Set from the character's side, the run follows: back to private, the visitor has neither.
  await signIn(context);
  await page.goto(`/b/${buildId}/edit`);
  await page.getByRole("region", { name: "Edit bar" }).getByRole("button", { name: /^Who can see it/ }).click();
  const back = page.waitForResponse((r) => r.request().method() === "POST");
  await page.getByRole("menu", { name: "Who can see it" }).getByRole("menuitemradio", { name: /^Only you/ }).click();
  await expect(page.getByRole("region", { name: "Edit bar" }).getByRole("button", { name: /^Who can see it/ })).toContainText("Only you");
  await back;
  await page.goto(`/b/${buildId}/edit/play`);
  await expect(page.getByRole("region", { name: "Edit bar" }).getByRole("button", { name: /^Who can see it/ })).toContainText("Only you");
});

test("what to do offers a person, closes its list on a pick, Escape and leaving, and the Quest field follows the pick", async ({ page, context, baseURL }) => {
  await signIn(context);
  const { pt, buildId } = await shell(page, context, baseURL!, "E2E One Visibility");
  const from = ip();
  const token = (await tokenFor(page, context, baseURL!, from)).access_token;
  const go = (name: string, args: object) => call(baseURL!, from, token, name, args);
  // An assistant links a person by name, and the page links to their page.
  const added = await go("add_objective", { playthrough: pt, act: "1", kind: "once", text: "Rent a room from Keerava", link: { kind: "person", name: "Keerava" } });
  expect(added.isError, added.text).toBe(false);
  await page.goto(`/p/${pt}`);
  await page.waitForURL(/\/b\/[^/]+\?tab=playthrough/);
  await expect(page.getByRole("link", { name: /Rent a room from Keerava/ })).toHaveAttribute("href", /\/people\/keerava/);

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`/b/${buildId}/edit/play`);
  await page.getByRole("button", { name: "+ Add an objective" }).click();
  const box = page.getByRole("combobox", { name: "Objective" });
  const list = page.getByRole("listbox");
  // People are offered, with the role and the town.
  await box.fill("Keerava");
  await expect(list.getByRole("option", { name: /^Keerava/ })).toContainText("Innkeeper");
  // Escape closes it; typing on opens it again.
  await box.press("Escape");
  await expect(list).toHaveCount(0);
  await box.fill("Keerav");
  await expect(list).toBeVisible();
  // Leaving the box closes it, even with words that would still match.
  await page.getByLabel("Why", { exact: true }).click();
  await expect(list).toHaveCount(0);
  await box.fill("Bannered Mare");
  await expect(list).toBeVisible();
  await box.press("Escape");
  // A pick closes it and the words stay closed.
  await box.fill("Complete A Rat Problem");
  const quest = list.getByRole("option", { name: /A Rat Problem/ }).first();
  await quest.hover();
  await quest.click();
  await expect(list).toHaveCount(0);
  await page.screenshot({ path: "test-results/wo179b-what-to-do-1440.png" });
  // The separate Quest field says the quest picked, not its placeholder.
  await expect(page.getByLabel("Quest", { exact: true })).toHaveValue("A Rat Problem");
  await expect(page.getByText("@ links a quest, a quest line, a place, a person, a spell, an item or a follower")).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "test-results/wo179b-what-to-do-390.png" });
});

test("What next keeps Details ticked and says her run; the width of the text is the column's", async ({ page, context }) => {
  await signIn(context);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/new");
  await page.getByRole("article").filter({ hasText: "Nord" }).getByText("+15").click();
  await expect(page.getByText("Draft saved")).toBeVisible();
  await page.goto("/new?step=name");
  await page.getByLabel("Name", { exact: true }).fill("Part Two Test");
  await page.getByLabel("She / her").check();
  await page.getByRole("button", { name: "Next: What next" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "What next" })).toBeVisible();
  // Details is behind you: no longer the current step, and ticked; What next is.
  const rail = page.getByRole("complementary", { name: "Setup steps" });
  await expect(rail.getByRole("button", { name: /^What next/ })).toHaveAttribute("aria-current", "step");
  await expect(rail.getByRole("button", { name: /^Details/ })).not.toHaveAttribute("aria-current", "step");
  await expect(rail.getByRole("button", { name: /^Details: done/ })).toBeVisible();
  const text = page.getByText(/A playthrough plans/);
  await expect(text).toContainText("plans her run through the game");
  await expect(text).not.toContainText("the character's");
  await page.screenshot({ path: "test-results/wo179b-what-next-1440.png" });
  // Text and its controls share one width: the paragraph is as wide as the column, not a narrow measure.
  const [p, h] = await Promise.all([text.boundingBox(), page.getByRole("heading", { level: 1, name: "What next" }).boundingBox()]);
  expect(p!.width).toBeGreaterThan(700);
  expect(Math.abs(p!.x - h!.x)).toBeLessThan(2);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "test-results/wo179b-what-next-390.png" });
  // Another step brings the step back.
  await rail.getByRole("button", { name: /^Details/ }).click();
  await expect(page.getByRole("heading", { level: 1, name: "What next" })).toHaveCount(0);
});

test("a character with no cover and no race shows the planner's mark, in the edit bar and on its card", async ({ page, context, baseURL }) => {
  await signIn(context);
  const { buildId } = await shell(page, context, baseURL!, "E2E One Visibility");
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`/b/${buildId}/edit/play`);
    const thumb = page.getByRole("link", { name: "Add a cover" }).locator("img");
    await expect(thumb).toHaveAttribute("src", "/icons/logo-0.svg");
    expect(await thumb.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
    await page.screenshot({ path: `test-results/wo179b-no-cover-bar-${width}.png`, clip: { x: 0, y: 0, width, height: 220 } });
    await page.goto("/me");
    const card = page.getByRole("article").filter({ hasText: "E2E One Visibility" });
    const mark = card.locator("img[class*='plainIcon']");
    await expect(mark).toHaveAttribute("src", "/icons/logo-0.svg");
    await card.scrollIntoViewIfNeeded();
    await page.screenshot({ path: `test-results/wo179b-no-cover-card-${width}.png` });
  }
});
