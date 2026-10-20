/**
 * WO-111: an assistant drafts a playthrough through the door on the test author's build (two acts,
 * five objectives with one refused, a suggestion, a beat and a chapter, finish_draft), then the
 * player on the site: private under My playthroughs, a tick opening the beat, the Tale view, editing
 * by hand with a @quest mention and the rule under a refused one, Accept, Enter it by hand. Another
 * player's token can't read it and a facts-only token can't write.
 */
import { expect, test } from "@playwright/test";
import { call, ip, signIn, tokenFor } from "./helpers";
import { TEST_BUILD_ID } from "./seed";

test.describe.configure({ mode: "serial" });

const from = ip();
let token = "";
let pid = "";
const RULE = "An objective is one thing you can know is done.";

test("an assistant drafts a playthrough end to end, refused for an objective that can't be known done", async ({ page, context, baseURL }) => {
  await signIn(context);
  const t = await tokenFor(page, context, baseURL!, from);
  expect(t.scope).toBe("facts builds:write playthroughs:write");
  token = t.access_token;
  const go = (name: string, args: object) => call(baseURL!, from, token, name, args);

  const made = await go("create_playthrough", { name: "E2E Kyria", line: "A knight of Stendarr hiding as a bard in Riften.", build: TEST_BUILD_ID });
  expect(made.isError, made.text).toBe(false);
  pid = made.json().playthrough;
  expect(made.json()).toMatchObject({ visibility: "private" });

  const one = await go("add_act", { playthrough: pid, name: "The Sister's House", levels: "1 to 6", place: "Riften", goal: "Earn a bed and coin in Riften as a bard and a worker.", standingRule: "Play the Bee and Barb most nights." });
  expect(one.isError, one.text).toBe(false);
  const two = await go("add_act", { playthrough: pid, name: "The Bard's Road", levels: "6 to 8", place: "Ivarstead", goal: "On foot, a song at every inn." });
  expect(two.isError, two.text).toBe(false);

  const objectives = [
    { act: "1", text: "Take a room at the Bee and Barb", kind: "once", byHand: true },
    { act: "1", text: "Warn Haelga, or expose her", kind: "once", link: { kind: "quest", name: "Caught Red Handed" }, quest: "Caught Red Handed", stage: 12, why: "From Svana at the bunkhouse." },
    { act: "1", text: "Reach level 6", kind: "reach", reachKey: "Level", reachTarget: 6 },
    { act: "1", text: "Hunt and tan her first hides", kind: "once", byHand: true, why: "Deer or elk around Lake Honrich." },
    { act: "The Bard's Road", text: "Join the Bards College", kind: "once", byHand: true },
  ];
  for (const o of objectives) {
    const r = await go("add_objective", { playthrough: pid, ...o });
    expect(r.isError, `${o.text}: ${r.text}`).toBe(false);
  }
  // Rule 14: a standing rule, and a done-once objective with no done-when, are refused; nothing saved.
  const every = await go("add_objective", { playthrough: pid, act: "1", text: "Read every new book", kind: "once", byHand: true });
  expect(every.isError).toBe(true);
  expect(every.text).toContain(RULE);
  const unknown = await go("add_objective", { playthrough: pid, act: "1", text: "Sing for the children at Honorhall", kind: "once" });
  expect(unknown.isError).toBe(true);
  expect(unknown.text).toContain(RULE);

  // WO-111b: a number to reach with no number says so, and a skill's number saves with its meter.
  const noNumber = await go("add_objective", { playthrough: pid, act: "2", text: "Play the lute", kind: "reach" });
  expect(noNumber.text).toBe("Say the number to reach: reachKey and reachTarget.");
  const lute = await go("add_objective", { playthrough: pid, act: "2", text: "Speech to 40 at the inns", kind: "reach", reachKey: "Speech", reachTarget: 40 });
  expect(lute.isError, lute.text).toBe(false);

  const sug = await go("suggest_objective", { playthrough: pid, act: "1", text: "The Book of Love", kind: "once", link: { kind: "line", name: "The Book of Love" }, byHand: true });
  expect(sug.isError, sug.text).toBe(false);
  expect(sug.json().suggested).toBe(true);

  // A beat needs its objective; then one that opens when the hides are tanned.
  expect((await go("write_chapter", { playthrough: pid, kind: "beat", title: "Made with Care", text: "The hide was rough under her hands." })).isError).toBe(true);
  const beat = await go("write_chapter", { playthrough: pid, kind: "beat", title: "Made with Care", text: "The hide was rough under her hands.", act: "1", after: "Hunt and tan her first hides" });
  expect(beat.isError, beat.text).toBe(false);
  const chapter = await go("write_chapter", { playthrough: pid, kind: "chapter", title: "Chapter One: The Chapel by the Sea", text: "The chapel bells in Anvil rang the hours.\n\nShe learned the songs before her letters." });
  expect(chapter.isError, chapter.text).toBe(false);

  // The save decides a save objective, never the assistant; an estimate isn't a snapshot.
  expect((await go("set_status", { playthrough: pid, objective: "Warn Haelga, or expose her", status: "done" })).text).toMatch(/save decides/);
  expect((await go("set_snapshot", { playthrough: pid, source: "hand", label: "Guess", level: 5, skills: {} })).isError).toBe(true);

  const got = (await go("get_playthrough", { playthrough: "E2E Kyria" })).json();
  expect(got.acts).toHaveLength(2);
  // The flat shape, the same fields add_objective takes.
  expect(got.acts[0].objectives[2]).toMatchObject({ text: "Reach level 6", kind: "reach", reachKey: "Level", reachTarget: 6 });
  expect(got.acts[0].objectives[1]).toMatchObject({ quest: "FreeformRiften11", stage: 12 });
  expect(got.acts[0].objectives[0]).toMatchObject({ byHand: true });
  const back = await go("set_objective", { playthrough: pid, objective: got.acts[0].objectives[2].objective, kind: "reach", reachKey: got.acts[0].objectives[2].reachKey, reachTarget: got.acts[0].objectives[2].reachTarget });
  expect(back.isError, back.text).toBe(false);
  expect(got.acts[0].objectives.map((o: { status: string }) => o.status)).toEqual(["to do", "to do", "to do", "to do", "suggested, waiting for the player"]);
  expect(got.done).toBe("0 of 6");

  const done = await go("finish_draft_playthrough", { playthrough: pid });
  expect(done.json()).toMatchObject({ ready: true, link: `${baseURL!.replace(/\/$/, "")}/p/${pid}` });

  const quests = await call(baseURL!, from, token, "suggest_quests", { level: 10 });
  expect(quests.isError, quests.text).toBe(false);
  for (const s of quests.json().suggestions) expect(s.checked).toBe("files");
});

test("on the site: private under My playthroughs, a tick opens the beat, Accept counts, by hand moves the meter", async ({ page, context }) => {
  await signIn(context);
  await page.goto("/me");
  const card = page.getByRole("link", { name: /E2E Kyria/ });
  await expect(card).toContainText("Drafted with E2E Claude");
  await expect(card).toContainText("Private");

  const playTab = () => page.getByRole("navigation", { name: "Views" }).getByRole("link", { name: /^Play/ });
  await page.goto(`/p/${pid}`);
  await expect(page.getByRole("heading", { name: "E2E Kyria" })).toBeVisible();
  await expect(playTab()).toContainText("0 of 6 done");
  await expect(page.getByText("Made with Care opens when you tick this.")).toBeVisible();
  // The Tale text is nowhere on the Play view, only its pointer.
  await expect(page.getByText("The hide was rough under her hands.")).toHaveCount(0);

  await page.getByRole("checkbox", { name: "Hunt and tan her first hides" }).click();
  await expect(page.getByText(/Made with Care\s*opened from this/)).toBeVisible();
  await expect(playTab()).toContainText("1 of 6 done");

  await page.getByRole("button", { name: "Accept" }).click();
  await expect(page.getByText("Suggested by E2E Claude")).toHaveCount(0);
  await expect(playTab()).toContainText("1 of 7 done");

  await expect(page.getByText("Level 6: not read yet")).toBeVisible();
  await page.getByRole("button", { name: "Enter it by hand" }).click();
  await page.getByLabel("Level").fill("6");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Level 6 of 6", { exact: true })).toBeVisible();
  await expect(playTab()).toContainText("2 of 7 done");
});

test("the Tale view shows the chapter, the opened beat and its way back to the game", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/p/${pid}/tale?from=1`);
  await expect(page.getByRole("heading", { name: "Chapter One: The Chapel by the Sea" })).toBeVisible();
  await expect(page.getByText("The chapel bells in Anvil rang the hours.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Made with Care" })).toBeVisible();
  const back = page.getByRole("link", { name: "Hunt and tan her first hides" });
  await expect(back).toBeVisible();
  await back.click();
  await expect(page).toHaveURL(new RegExp(`/p/${pid}\\?act=1#o\\d+`));
});

test("editing by hand: a @quest mention, and the rule under a refused objective", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/p/${pid}/edit`);
  await expect(page.getByText("Editing E2E Kyria")).toBeVisible();
  await page.getByRole("button", { name: "Add an objective" }).click();
  const box = page.getByRole("combobox", { name: "Objective" }).last();
  await box.fill("@Spread the");
  await page.getByRole("option", { name: /^Spread the Love/ }).first().click();
  await expect(page.getByText("Quest: Spread the Love")).toBeVisible();
  await expect.poll(async () => (await page.reload(), await page.getByText("Quest: Spread the Love").count())).toBeGreaterThan(0);

  await page.getByRole("button", { name: "Add an objective" }).click();
  await page.getByRole("combobox", { name: "Objective" }).last().fill("Read every new book");
  await expect(page.getByText(RULE).first()).toBeVisible();
});

test("another player's token can't read it, and a facts-only token can't write", async ({ page, context, baseURL }) => {
  const other = ip();
  await signIn(context, "other");
  const t = await tokenFor(page, context, baseURL!, other);
  const read = await call(baseURL!, other, t.access_token, "get_playthrough", { playthrough: pid });
  expect(read.isError).toBe(true);
  expect(read.text).toMatch(/No playthrough of yours/);
  await page.goto(`/p/${pid}`);
  await expect(page.getByRole("heading", { name: "E2E Kyria" })).toHaveCount(0);

  await context.clearCookies();
  await signIn(context);
  const facts = await tokenFor(page, context, baseURL!, other, "facts");
  const write = await call(baseURL!, other, facts.access_token, "add_act", { playthrough: pid, name: "Act Three", levels: "8 to 20", place: "Solitude", goal: "Join the College." });
  expect(write.isError).toBe(true);
  expect(write.text).toMatch(/doesn't allow this/);
});

// WO-111a: a quest the save decides can be ticked by the player until a snapshot shows its stage.
test("a quest objective the save decides: ticked by the player, then the save's word once it shows the stage", async ({ page, context, baseURL }) => {
  await signIn(context);
  const go = (name: string, args: object) => call(baseURL!, from, token, name, args);
  const added = await go("add_objective", { playthrough: pid, act: "2", text: "Spread the Love", kind: "once", link: { kind: "quest", name: "Spread the Love" }, quest: "Spread the Love", stage: 10 });
  expect(added.isError, added.text).toBe(false);
  // The door still can't tick it: the save is the assistant's only source.
  expect((await go("set_status", { playthrough: pid, objective: added.json().objective, status: "done" })).text).toMatch(/save decides/);

  await page.goto(`/p/${pid}?act=2`);
  const row = page.locator(`#o${added.json().objective}`);
  await row.getByRole("checkbox", { name: "Spread the Love" }).click();
  await expect(row.getByText("Done, ticked by you")).toBeVisible();

  const snap = await go("set_snapshot", { playthrough: pid, source: "save", label: "Save 8", level: 7, skills: {}, questStages: { FreeformRiften05: 10 } });
  expect(snap.isError, snap.text).toBe(false);
  await page.reload();
  await expect(row.getByText("Done, from your save")).toBeVisible();
  await expect(row.getByRole("checkbox")).toHaveCount(0);
});
