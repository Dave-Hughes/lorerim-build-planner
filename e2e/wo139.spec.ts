/**
 * WO-139: before you design. Through the door, set_details keeps the answers and the never list on the character's run;
 * suggest_quests leaves out the stories behind it, get_quest says locked for this character, suggest_objective refuses
 * and add_objective warns. Play shows the answers as About her at 1440 and 390; the edit page edits them.
 */
import { expect, test } from "@playwright/test";
import { call, ip, savedInBand, signIn, tokenFor } from "./helpers";
import { SCRATCH_BUILD_ID } from "./seed";

test.describe.configure({ mode: "serial" });

const from = ip();
let pid = "";

const ANSWERS = [
  { question: "Will this character be the Dragonborn?", answer: "No. She hunts for coin and keeps out of the dragons' way." },
  { question: "What do they do when something attacks?", answer: "A bow from the treeline, a dagger if it gets close." },
  { question: "Which factions, and which never?", answer: "The Companions maybe. Never the Dark Brotherhood." },
];
const MODS = [
  { name: "Callings", why: "A start that makes sense for a bard or a scholar, instead of crabs, wolves and bandits.", need: "required" },
  { name: "Immersive Citizens", link: "https://www.nexusmods.com/skyrimspecialedition/mods/1", why: "Towns that react to her.", need: "recommended" },
];
const NEVER = [
  { what: "main-quest", words: "she won't be the Dragonborn" },
  { what: "the-dark-brotherhood", words: "she won't take a contract" },
  { what: "never sleeps in a city twice" },
];

test("an assistant keeps the answers and the never list, and the quest tools keep to it", async ({ page, context, baseURL }) => {
  await signIn(context);
  const token = (await tokenFor(page, context, baseURL!, from)).access_token;
  const go = (name: string, args: object) => call(baseURL!, from, token, name, args);

  pid = (await go("create_playthrough", { name: "E2E Hunter" })).json().playthrough;
  const set = await go("set_details", { playthrough: pid, answers: ANSWERS, never: NEVER, mods: MODS });
  expect(set.isError, set.text).toBe(false);
  expect(set.json().about.never.map((n: { is: string }) => n.is)).toEqual(["a quest line: The main quest", "a quest line: The Dark Brotherhood", "the player's own words"]);
  expect(set.json().neverNote).toContain("keep to it yourself");
  // An id that names nothing is refused, and nothing changes.
  const slip = await go("set_details", { playthrough: pid, never: [{ what: "the-thieves-gild" }] });
  expect(slip.isError).toBe(true);
  expect(slip.text).toContain("Nothing is called the-thieves-gild");

  const got = (await go("get_playthrough", { playthrough: pid })).json();
  expect(got.mods).toEqual(MODS);
  expect(got.about.answers).toEqual(ANSWERS);
  expect(got.about.never).toHaveLength(3);

  const suggested = (await go("suggest_quests", { level: 12, playthrough: pid })).json();
  expect(suggested.suggestions.map((s: { name: string }) => s.name)).not.toContain("Join the Dark Brotherhood");
  expect(suggested.leftOut).toMatch(/^left out: 2 stories this character won't do/);

  expect((await go("get_quest", { name: "Dragonborn", playthrough: pid, level: 30 })).json().openForYou.says).toBe("locked for this character: she won't be the Dragonborn");

  expect((await go("add_act", { playthrough: pid, name: "East", levels: "6 to 12", place: "Windhelm", goal: "Furs to sell in Windhelm." })).isError).toBe(false);
  const refused = await go("suggest_objective", { playthrough: pid, act: "1", kind: "once", text: "Talk to Aventus Aretino", link: { kind: "quest", name: "Innocence Lost" } });
  expect(refused.isError).toBe(true);
  expect(refused.text).toContain("Not suggested: Innocence Lost is behind something this character won't do (she won't take a contract).");
  const added = await go("add_objective", { playthrough: pid, act: "1", kind: "once", text: "Talk to Aventus Aretino", link: { kind: "quest", name: "Innocence Lost" } });
  expect(added.json().warnings).toEqual(expect.arrayContaining([expect.objectContaining({ code: "never", message: 'Act I East sends this character to Innocence Lost ("Talk to Aventus Aretino"); she won\'t take a contract.' })]));
  expect((await go("get_playthrough", { playthrough: pid })).json().warnings.map((w: { code: string }) => w.code)).toContain("never");

  // Part 5: never kills, read from each quest's objectives.
  expect((await go("set_details", { playthrough: pid, never: [{ what: "kill", words: "she never kills" }] })).isError).toBe(false);
  expect((await go("get_quest", { id: "DBSideContract04", playthrough: pid, level: 30 })).json().openForYou.says).toBe("locked for this character: needs a kill: Kill Hern; she never kills");
  expect((await go("get_quest", { id: "TG02", playthrough: pid, level: 30 })).json().openForYou.says).toMatch(/kill-free as far as the objectives go$/);
  const noContract = await go("suggest_objective", { playthrough: pid, act: "1", kind: "once", text: "Kill Hern", link: { kind: "quest", name: "Contract: Kill Hern" } });
  expect(noContract.isError).toBe(true);
  expect(noContract.text).toContain("needs a kill: Kill Hern");

  // Part 4: what LoreRim already lets a character do.
  const rules = (await go("get_rules", {})).json();
  expect(rules.activities[0]).toMatchObject({ by: "Skyrim's Got Talent", inLoreRim: true });
  expect(rules.activities.filter((a: { inLoreRim: boolean }) => !a.inLoreRim).map((a: { by: string }) => a.by)).toEqual(["Callings"]);
});

for (const width of [1440, 390]) {
  test(`Play shows the answers as About her at ${width}`, async ({ page, context }) => {
    await signIn(context);
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`/p/${pid}`);
    const about = page.getByRole("region", { name: "About her" });
    await expect(about.locator("dt")).toHaveText(ANSWERS.map((a) => a.question));
    await expect(about.locator("dd").first()).toHaveText(ANSWERS[0].answer);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    await page.screenshot({ path: `test-results/wo139-about-${width}.png`, fullPage: true });
    await page.goto(`/p/${pid}/edit/play`);
    await expect(page.getByLabel("Answer 3")).toHaveValue(ANSWERS[2].answer);
    await page.getByLabel("Question 1").scrollIntoViewIfNeeded();
    await page.screenshot({ path: `test-results/wo139-edit-${width}.png` });
  });
}

test("the edit page edits, adds and removes an answer", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/p/${pid}/edit/play`);
  const saved = () => page.waitForResponse((r) => r.request().method() === "POST" && r.url().includes("/edit/play"));
  await page.getByLabel("Answer 2").fill("A bow, always.");
  await Promise.all([saved(), page.getByLabel("Answer 2").blur()]);
  await savedInBand(page);
  await Promise.all([saved(), page.getByRole("button", { name: "Remove" }).first().click()]);
  await savedInBand(page);
  await page.getByRole("button", { name: "Add an answer" }).click();
  await page.getByLabel("Question 3").fill("Do they want a mount?");
  await page.getByLabel("Answer 3").fill("She walks.");
  await Promise.all([saved(), page.getByLabel("Answer 3").blur()]);
  await savedInBand(page);
  await page.goto(`/p/${pid}`);
  await expect(page.getByRole("region", { name: "About her" }).locator("dt")).toHaveText([ANSWERS[1].question, ANSWERS[2].question, "Do they want a mount?"]);
  await expect(page.getByRole("region", { name: "About her" })).toContainText("A bow, always.");
});

for (const width of [1440, 390]) {
  test(`Play shows the mods this character needs at ${width}`, async ({ page, context }) => {
    await signIn(context);
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`/p/${pid}`);
    const mods = page.getByRole("region", { name: "Mods this character needs" });
    await expect(mods.locator("dt")).toHaveText(["Callings", "Immersive Citizens"]);
    await expect(mods.getByRole("heading", { name: "Recommended" })).toBeVisible();
    await expect(mods.getByRole("link", { name: "Callings" })).toHaveCount(0);
    await expect(mods.getByRole("link", { name: "Immersive Citizens" })).toHaveAttribute("href", MODS[1].link!);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    await page.screenshot({ path: `test-results/wo139-mods-${width}.png`, fullPage: true });
  });
}

test("the run's edit page adds and removes a mod", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/p/${pid}/edit/play`);
  const saved = () => page.waitForResponse((r) => r.request().method() === "POST" && r.url().includes("/edit/play"));
  await expect(page.getByLabel("Mod 1 name")).toHaveValue("Callings");
  await Promise.all([saved(), page.getByLabel("Mod 2 name").locator("xpath=..").getByRole("button", { name: "Remove" }).click()]);
  await savedInBand(page);
  await page.goto(`/p/${pid}`);
  await expect(page.getByRole("region", { name: "Mods this character needs" }).locator("dt")).toHaveText(["Callings"]);
  await page.goto(`/p/${pid}/edit/play`);
  await page.getByRole("button", { name: "Add a mod" }).click();
  await page.getByLabel("Mod 2 name").fill("Wintersun");
  await page.getByLabel("Mod 2 why").fill("She is devout.");
  await Promise.all([saved(), page.getByLabel("Mod 2 why").blur()]);
  await savedInBand(page);
  await page.goto(`/p/${pid}`);
  await expect(page.getByRole("region", { name: "Mods this character needs" }).locator("dt")).toHaveText(["Callings", "Wintersun"]);
});

test("a build's Set up keeps its mods and its page shows them", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/b/${SCRATCH_BUILD_ID}/setup?step=name`);
  await page.getByRole("button", { name: "Add a mod" }).click();
  await page.getByLabel("Mod 1 name").fill("Callings");
  await page.getByLabel("Mod 1 why").fill("A bard's start.");
  await page.getByLabel("Mod 1 why").blur();
  await page.getByLabel("Mod 1 link").fill("https://www.nexusmods.com/skyrimspecialedition/mods/2");
  await page.getByLabel("Mod 1 link").blur();
  await expect(page.getByText("Saved", { exact: false }).first()).toBeVisible();
  await page.waitForTimeout(1500);
  await page.goto(`/b/${SCRATCH_BUILD_ID}`);
  const mods = page.getByRole("region", { name: "Mods this character needs" });
  await expect(mods.getByRole("link", { name: "Callings" })).toHaveAttribute("href", "https://www.nexusmods.com/skyrimspecialedition/mods/2");
  await expect(mods).toContainText("A bard's start.");
});
