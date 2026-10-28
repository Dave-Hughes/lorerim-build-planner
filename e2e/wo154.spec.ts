/**
 * WO-154: quest pages, line pages and the connector, from the quest reads. A quest page has the page's sections in order and no
 * stage numbers or "game files" tags; a line of one quest isn't a line; a shelf's jobs are grouped by where you pick them up;
 * get_quest returns the same sections in the same order, and suggest_quests the short form.
 */
import { expect, test } from "@playwright/test";
import { call, ip, signIn, tokenFor } from "./helpers";

for (const width of [1440, 390]) {
  test(`Lights Out! at ${width}: the sections in order, Dave's day in the game for where Jaree-Ra is, no stage numbers`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/quests/q/lights-out");
    await expect(page.getByRole("heading", { level: 1, name: "Lights Out!" })).toBeVisible();
    const order = await page.locator("main h2").allInnerTexts();
    const wanted = ["How to start it", "5 ways to finish it", "Where it takes you", "Rewards", "People", "What it closes", "Information Confidence"];
    expect(order.map((t) => t.toLowerCase())).toEqual(expect.arrayContaining(wanted.map((t) => t.toLowerCase())));
    expect(wanted.map((t) => order.findIndex((o) => o.toLowerCase() === t.toLowerCase()))).toEqual([...wanted.map((t) => order.findIndex((o) => o.toLowerCase() === t.toLowerCase()))].sort((a, b) => a - b));
    await expect(page.getByRole("region", { name: "How to start it" })).toContainText("Talk to Jaree-Ra in Solitude, by the Winking Skeever");
    await expect(page.getByRole("link", { name: "Broken Oar Grotto" }).first()).toHaveAttribute("href", /\/places\/broken-oar-grotto$/);
    await expect(page.locator("main")).not.toContainText(/Red Wave|stage \d+/i);
    await expect(page.getByText("game files", { exact: true })).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    await page.screenshot({ path: `test-results/wo154-lights-out-${width}.png`, fullPage: true });
  });
}

test("Mourning Never Comes (a read quest): nothing from the rules, its own mod, who and where first", async ({ page }) => {
  await page.goto("/quests/q/mourning-never-comes");
  await expect(page.locator("main")).not.toContainText(/Abandoned Shack Key|The door from/);
  await expect(page.locator("main").getByText("Vanilla", { exact: true })).toBeVisible();
  await page.goto("/quests/q/speaking-with-silence");
  await expect(page.getByRole("region", { name: "How to start it" })).toContainText(/Mercer Frey\s+in /);
});

test("a line of one quest isn't a line: its category card opens the quest, and its line address goes there", async ({ page }) => {
  await page.goto("/quests/c/side-stories");
  const card = page.getByRole("row").filter({ has: page.getByRole("link", { name: "Lights Out!" }) });
  await expect(card.getByRole("link", { name: "Lights Out!" })).toHaveAttribute("href", "/quests/q/lights-out");
  await page.goto("/quests/lights-out");
  await expect(page).toHaveURL(/\/quests\/q\/lights-out$/);
  await expect(page.getByRole("link", { name: /Side stories/ }).first()).toHaveAttribute("href", "/quests/c/side-stories");
});

test("a shelf's jobs are grouped by where you pick them up, with no The story heading", async ({ page }) => {
  await page.goto("/quests/capital-whiterun");
  await expect(page.getByRole("heading", { name: "The story" })).toHaveCount(0);
  await expect(page.getByRole("region", { name: "Jobs" })).toBeVisible();
  await expect(page.getByText("game files", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Not listed")).toHaveCount(0);
  await page.screenshot({ path: "test-results/wo154-shelf-1440.png", fullPage: true });
});

test("the door: get_quest returns the page's sections in its order, suggest_quests the short form with no null start", async ({ page, context, baseURL }) => {
  await signIn(context);
  const from = ip();
  const token = (await tokenFor(page, context, baseURL!, from)).access_token;
  const go = (name: string, args: object) => call(baseURL!, from, token, name, args);
  const q = (await go("get_quest", { name: "Lights Out!" })).json().quest;
  const sections = ["source", "canDo", "needs", "starts", "takesYou", "choices", "gets", "opens", "closes", "steps", "howSure"];
  expect(Object.keys(q).filter((k) => sections.includes(k))).toEqual(sections);
  expect(q.starts[0]).toMatchObject({ who: "Jaree-Ra", where: "Solitude, by the Winking Skeever" });
  expect(JSON.stringify(q)).not.toMatch(/Red Wave/);
  const s = (await go("suggest_quests", { level: 12, where: "Haafingar" })).json();
  expect(s.suggestions.length).toBeGreaterThan(0);
  for (const x of s.suggestions) {
    expect(x.start).toEqual(expect.any(String));
    expect(x.starts).not.toBeNull();
    expect(Object.keys(x)).toEqual(expect.arrayContaining(["canDo", "needs", "starts", "gets"]));
  }
});

test("a person's page: race, town, the cell they are placed in, their quests, and what isn't known said so", async ({ page }) => {
  await page.goto("/people/mjoll-the-lioness");
  await expect(page.getByRole("heading", { level: 1, name: "Mjoll the Lioness" })).toBeVisible();
  await expect(page.locator("main")).toContainText("Nord");
  // What she is, from the records' own fields (WO-154 Part 4); and no "placed in": the editor's cell isn't where you meet her.
  await expect(page.locator("main")).toContainText("A Nord in Riften. She gives two quests.");
  await expect(page.locator("main")).not.toContainText("placed in");
  for (const chip of ["Follower", "Can marry", "Gives quests", "Can't be killed"]) await expect(page.locator("main").getByText(chip, { exact: true }).first()).toBeVisible();
  // Nothing about the hours is known, so there is no section for them (WO-157); Information Confidence says what isn't sure.
  await expect(page.getByRole("heading", { name: /Where to find/ })).toHaveCount(0);
  await expect(page.getByRole("region", { name: "Information Confidence" })).toContainText("Where they are through the day and night");
  await expect(page.getByRole("region", { name: "Information Confidence" })).toContainText("A second reader hasn't checked this page yet");
  expect((await page.goto("/people/not-a-person"))?.status()).toBe(404);
});

test("a place's page: the danger gauge, the boss, what points here, what it pays", async ({ page }) => {
  await page.goto("/places/broken-oar-grotto");
  await expect(page.getByRole("heading", { level: 1, name: "Broken Oar Grotto" })).toBeVisible();
  await expect(page.getByRole("img", { name: /Bandits from level 6 to 24; the boss from level 19 to 24/ })).toBeVisible();
  await expect(page.getByRole("region", { name: "Quests that bring you here" }).getByRole("link", { name: "Lights Out!" })).toHaveAttribute("href", "/quests/q/lights-out");
  await expect(page.getByRole("region", { name: "What people say about it" })).toContainText("Note from Jaree-Ra");
  await expect(page.getByRole("region", { name: "Rewards" })).toContainText("100 XP");
});

test("a line with a read: its own words for what it is, how to get in, the quests in order, what it gives, and how sure", async ({ page }) => {
  await page.goto("/quests/main-quest");
  await expect(page.getByRole("heading", { level: 1, name: "Become the Dragonborn" })).toBeVisible();
  await expect(page.locator("main")).toContainText("Dragons have come back to Skyrim");
  await expect(page.getByRole("region", { name: "At a glance" })).toContainText("Helgen");
  await expect(page.getByRole("link", { name: "Bleak Falls Barrow" }).first()).toHaveAttribute("href", "/quests/q/bleak-falls-barrow");
  await expect(page.getByRole("region", { name: "What the whole line gives" })).toContainText("Thane of Whiterun");
  await expect(page.getByRole("region", { name: "Information Confidence" })).toBeVisible();
});

test("search forgives a misspelling and finds a quest, a person and a place; the menu has People and Places", async ({ page }) => {
  await page.goto("/search?q=Palonimo");
  await expect(page.getByRole("region", { name: "Quests" }).getByRole("link", { name: "Running Wild" })).toBeVisible();
  await page.goto("/search?q=Brynjof");
  await expect(page.getByRole("region", { name: "People" }).getByRole("link", { name: "Brynjolf" }).first()).toHaveAttribute("href", /\/people\/brynjolf/);
  await page.goto("/search?q=Broken Oar");
  await expect(page.getByRole("region", { name: "Places" }).getByRole("link", { name: "Broken Oar Grotto" }).first()).toHaveAttribute("href", "/places/broken-oar-grotto");
  await expect(page.getByRole("navigation", { name: "Site" }).getByRole("link")).toContainText(["Characters", "Guide"]);
  await page.getByRole("banner").getByRole("button", { name: "World" }).click();
  await expect(page.getByRole("banner").getByRole("link", { name: /^People/ })).toBeVisible();
});

test("the Quests page: the big lines first, then everything else by place", async ({ page }) => {
  await page.goto("/quests");
  const heads = await page.locator("main h2").allInnerTexts();
  expect(heads.at(-1)).toMatch(/Everything else, by place/i);
  await expect(page.getByRole("cell", { name: "Riften", exact: true }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Main stories/ }).first()).toBeVisible();
});

test("confirm it's accurate: signed out it asks to sign in; signed in it records, shows the name and the count, and Undo takes it back", async ({ page, context }) => {
  await page.goto("/quests/q/lights-out");
  await expect(page.getByRole("button", { name: "Sign in to confirm" })).toBeVisible();
  await signIn(context);
  for (const url of ["/quests/q/lights-out", "/people/mjoll-the-lioness", "/places/broken-oar-grotto"]) {
    await page.goto(url);
    await page.getByRole("button", { name: "Confirm it's accurate" }).click();
    const dialog = page.getByRole("dialog", { name: "Confirmed" });
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("Your name is now on");
    await dialog.getByRole("button", { name: "Close" }).click();
    await page.reload();
    await expect(page.getByRole("region", { name: "Information Confidence" })).toContainText("Confirmed by 1 player");
    await page.getByRole("button", { name: "Undo my confirmation" }).click();
    await expect(page.getByRole("button", { name: "Confirm it's accurate" })).toBeVisible();
    await page.reload();
    await expect(page.getByRole("region", { name: "Information Confidence" })).not.toContainText("Confirmed by 1 player");
  }
});

test("screenshots for Dave: the read quests and the lines, at 1440 and 390", async ({ page }) => {
  for (const [slug, name] of [
    ["quests/q/lights-out", "lights-out"],
    ["quests/q/the-golden-claw", "golden-claw"],
    ["people/mjoll-the-lioness", "mjoll"],
    ["places/broken-oar-grotto", "broken-oar-grotto"],
    ["quests/q/speaking-with-silence", "speaking-with-silence"],
    ["quests/q/reparations", "reparations"],
    ["quests/q/mourning-never-comes", "mourning-never-comes"],
    ["quests/thieves-guild", "thieves-guild-line"],
    ["quests/main-quest", "main-quest-line"],
    ["quests/capital-whiterun", "more-to-do-in-whiterun"],
  ]) {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${slug}`);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), `${slug} at ${width}`).toBeLessThanOrEqual(0);
      await page.screenshot({ path: `test-results/wo154-${name}-${width}.png`, fullPage: true });
    }
  }
});
