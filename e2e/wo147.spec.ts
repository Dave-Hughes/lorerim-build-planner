/**
 * WO-147: a page for every quest, and grab-bags as shelves. /quests/q/<slug> says how a quest starts, its first step, its
 * objectives, how it ends, what it is part of and where it was checked, with its own report forms; a shelf's page opens on no
 * quest's opening, and its rows link to the quests' pages with a line of how each starts; the door links to the quest page.
 */
import { expect, test } from "@playwright/test";
import { call, ip, signIn, tokenFor } from "./helpers";

for (const width of [1440, 390]) {
  test(`Running Wild's page at ${width}: how it starts, its first step, how it ends, what it is part of`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/quests/q/running-wild");
    await expect(page.getByRole("heading", { level: 1, name: "Running Wild" })).toBeVisible();
    const start = page.getByRole("region", { name: "How to start it" });
    await expect(start).toContainText("Read the note pinned to the board outside Joslin's house");
    // Its first step is the first of its steps, under "ways to finish it" (WO-154 Part 2).
    await expect(page.locator("main")).toContainText("Catch the white, or palonimo, horse roaming the fields of Whiterun");
    await expect(page.getByText("game files", { exact: true })).toHaveCount(0);
    await expect(page.locator("main")).toContainText("Bring the Horse back to the main gate of Whiterun");
    await expect(page.getByRole("region", { name: "Rewards" })).toContainText(/saddle|horse/i);
    // On a shelf, a quest stands alone: it goes back to the shelf, and no quest comes before or after it.
    await expect(page.getByRole("link", { name: /More to do in Whiterun/ }).first()).toHaveAttribute("href", "/quests/capital-whiterun");
    await expect(page.getByText("Before it")).toHaveCount(0);
    await expect(page.getByText("After it")).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    await page.screenshot({ path: `test-results/wo147-running-wild-${width}.png`, fullPage: true });
  });

  test(`a main-quest page at ${width}: Bleak Falls Barrow names the quests before and after it`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/quests/q/bleak-falls-barrow");
    await expect(page.getByRole("heading", { level: 1, name: "Bleak Falls Barrow" })).toBeVisible();
    await expect(page.getByRole("link", { name: "The main quest" }).first()).toHaveAttribute("href", "/quests/main-quest");
    // Read from its records (WO-154): what it needs is Before the Storm, what it opens is Dragon Rising, each a link to its page.
    await expect(page.getByRole("region", { name: "How to start it" }).getByRole("link", { name: /Before the Storm/ })).toHaveAttribute("href", "/quests/q/before-the-storm");
    await expect(page.getByRole("region", { name: /What it (opens|closes)/ }).getByRole("link", { name: "Dragon Rising" })).toHaveAttribute("href", "/quests/q/dragon-rising");
    await page.screenshot({ path: `test-results/wo147-bleak-falls-barrow-${width}.png`, fullPage: true });
  });
}

test("a slug that names no quest is not found", async ({ page }) => {
  expect((await page.goto("/quests/q/no-such-quest"))?.status()).toBe(404);
});

test("the report forms on a quest's page are for that quest, and a quest's page never speaks of the signed-in player's character", async ({ page, context }) => {
  await signIn(context);
  await page.goto("/quests/q/running-wild?report=1#report");
  await page.getByLabel("I know where this is").check();
  // One quest on the page: no Which quest?
  await expect(page.getByLabel("Which quest?")).toHaveCount(0);
  // Dave, 27 Oct: a quest's page has no context of a character or a playthrough, signed in or not.
  await page.goto("/quests/q/running-wild");
  await expect(page.locator("main")).not.toContainText(/\bFor [A-Z][^:\n]+:|open for you|Kyria/);
});

test("a shelf opens on no quest's opening, its rows link to the quests and say how each starts", async ({ page }) => {
  await page.goto("/quests/capital-whiterun");
  await expect(page.getByRole("heading", { level: 1, name: "More to do in Whiterun" })).toBeVisible();
  // The Bluesky Hall messenger is one quest's start, not the shelf's.
  await expect(page.getByText("I've recieved a note by a messenger")).toHaveCount(0);
  await expect(page.getByText("Starts here")).toHaveCount(0);
  await expect(page.getByRole("region", { name: "How to start them" })).toContainText("Separate jobs, each with its own start");
  const rat = page.locator('[id="q-0WRRatQuest"]');
  await expect(rat.getByRole("link", { name: "A Rat Problem" })).toHaveAttribute("href", "/quests/q/a-rat-problem");
  await expect(rat).toContainText("Igna");
  // Skirmish at Whitewatch's placeholder objective is not shown.
  await page.goto("/quests/q/skirmish-at-whitewatch");
  await expect(page.getByRole("region", { name: "The steps" })).not.toContainText("TEST");
  await page.screenshot({ path: "test-results/wo147-shelf-line-1440.png" });
});

test("the door links get_quest, search_facts and the quest log to the quest's page", async ({ page, context, baseURL }) => {
  await signIn(context);
  const from = ip();
  const token = (await tokenFor(page, context, baseURL!, from)).access_token;
  const go = (name: string, args: object) => call(baseURL!, from, token, name, args);
  const rat = (await go("get_quest", { name: "A Rat Problem" })).json();
  expect(rat.link).toBe(`${baseURL}/quests/q/a-rat-problem`);
  expect(JSON.stringify(rat)).not.toMatch(/messenger|Bluesky|comes after/i);
  const found = (await go("search_facts", { query: "Running Wild", kinds: ["quest"] })).json();
  expect(found.hits[0]).toMatchObject({ name: "Running Wild", link: `${baseURL}/quests/q/running-wild` });
  const pt = (await go("create_playthrough", { name: "E2E Links" })).json().playthrough;
  await go("add_act", { playthrough: pt, name: "Whiterun", levels: "1 to 5", place: "Whiterun", goal: "A horse." });
  await go("add_objective", { playthrough: pt, act: "1", kind: "once", text: "Catch the white horse", link: { kind: "quest", name: "Running Wild" } });
  const got = (await go("get_playthrough", { playthrough: pt })).json();
  expect(got.acts[0].objectives[0].page).toBe(`${baseURL}/quests/q/running-wild`);
  // The page's own link for it goes to the quest's page too.
  await page.goto(`/p/${pt}`);
  await expect(page.getByRole("link", { name: "Catch the white horse" })).toHaveAttribute("href", /\/quests\/q\/running-wild/);
});
