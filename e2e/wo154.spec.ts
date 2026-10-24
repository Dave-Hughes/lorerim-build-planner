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
    const wanted = ["What you need first", "How to start it", "What you get", "The steps"];
    expect(order.map((t) => t.toLowerCase())).toEqual(expect.arrayContaining(wanted.map((t) => t.toLowerCase())));
    expect(wanted.map((t) => order.findIndex((o) => o.toLowerCase() === t.toLowerCase()))).toEqual([...wanted.map((t) => order.findIndex((o) => o.toLowerCase() === t.toLowerCase()))].sort((a, b) => a - b));
    await expect(page.getByRole("region", { name: "How to start it" })).toContainText("Talk to Jaree-Ra in Solitude, by the Winking Skeever");
    await expect(page.locator("main")).not.toContainText(/Red Wave|stage \d+/i);
    await expect(page.getByText("game files", { exact: true })).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    await page.screenshot({ path: `test-results/wo154-lights-out-${width}.png`, fullPage: true });
  });
}

test("Mourning Never Comes (a read quest): nothing from the rules, its own mod, who and where first", async ({ page }) => {
  await page.goto("/quests/q/mourning-never-comes");
  await expect(page.locator("main")).not.toContainText(/Abandoned Shack Key|The door from/);
  const tags = page.locator("main").first().locator('[class*="coverMeta"] [class*="tag"]');
  await expect(tags).toHaveText(["Base game"]);
  await page.goto("/quests/q/speaking-with-silence");
  const way = page.getByRole("region", { name: "How to start it" }).getByRole("listitem").first();
  await expect(way.locator("b")).toHaveText("Mercer Frey");
  expect((await way.innerText()).startsWith("Mercer Frey, in ")).toBe(true);
});

test("a line of one quest isn't a line: its category card opens the quest, and its line address goes there", async ({ page }) => {
  await page.goto("/quests/c/side-stories");
  const card = page.getByRole("article", { name: "Lights Out!" });
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

test("screenshots for Dave: the read quests and the lines, at 1440 and 390", async ({ page }) => {
  for (const [slug, name] of [
    ["quests/q/lights-out", "lights-out"],
    ["quests/q/speaking-with-silence", "speaking-with-silence"],
    ["quests/q/reparations", "reparations"],
    ["quests/q/mourning-never-comes", "mourning-never-comes"],
    ["quests/thieves-guild", "thieves-guild-line"],
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
