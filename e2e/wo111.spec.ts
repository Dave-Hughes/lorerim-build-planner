/**
 * WO-111: an assistant drafts a playthrough through the door on the test author's build (two acts,
 * five objectives with one refused, a suggestion, a beat and a chapter, finish_draft), then the
 * player on the site: private on its build's card, a tick opening the beat, the reader (WO-116), editing
 * by hand with a @quest mention and the rule under a refused one, Accept, Enter it by hand. Another
 * player's token can't read it and a facts-only token can't write.
 */
import { expect, test } from "@playwright/test";
import { call, ip, signIn, tokenFor } from "./helpers";
import { OTHER_BUILD_ID, TEST_BUILD_ID } from "./seed";

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

  const made = await go("create_playthrough", { name: "E2E Kyria", line: "A knight of Stendarr hiding as a bard in Riften." });
  expect(made.isError, made.text).toBe(false);
  pid = made.json().playthrough;
  expect(made.json()).toMatchObject({ visibility: "private" });

  // WO-111c: the build drafted after the playthrough, linked through the door; another player's is refused.
  expect((await go("get_playthrough", { playthrough: pid })).json().build).toBeNull();
  const theirs = await go("set_playthrough", { playthrough: pid, build: OTHER_BUILD_ID });
  expect(theirs.isError).toBe(true);
  expect(theirs.text).toContain(`No build of yours has the id or name ${OTHER_BUILD_ID}`);
  const linked = await go("set_playthrough", { playthrough: pid, build: "Test Shield-Wall" });
  expect(linked.isError, linked.text).toBe(false);
  expect(linked.json().build).toEqual({ id: TEST_BUILD_ID, name: "Test Shield-Wall" });
  expect((await go("get_playthrough", { playthrough: pid })).json().build).toMatchObject({ id: TEST_BUILD_ID, name: "Test Shield-Wall" });
  const listed = (await go("list_my_playthroughs", {})).json().find((x: { playthrough: string }) => x.playthrough === pid);
  expect(listed.build).toEqual({ id: TEST_BUILD_ID, name: "Test Shield-Wall" });

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
  // Rule 14: a standing rule is refused; nothing saved.
  const every = await go("add_objective", { playthrough: pid, act: "1", text: "Read every new book", kind: "once", byHand: true });
  expect(every.isError).toBe(true);
  expect(every.text).toContain(RULE);
  // WO-123: a done-once objective with nothing the save reads is one the player ticks; asking the save to tick it says why it can't.
  const sing = await go("add_objective", { playthrough: pid, act: "1", text: "Sing for the children at Honorhall", kind: "once" });
  expect(sing.isError, sing.text).toBe(false);
  expect((await go("add_objective", { playthrough: pid, act: "1", text: "Sing at the Bee and Barb", kind: "once", fromSave: true })).text).toMatch(/^Nothing in it the save can read/);
  expect((await go("remove_objective", { playthrough: pid, objective: sing.json().objective })).isError).toBe(false);

  // WO-111b: a number to reach with no number says so, and a skill's number saves with its meter.
  const noNumber = await go("add_objective", { playthrough: pid, act: "2", text: "Play the lute", kind: "reach" });
  expect(noNumber.text).toBe("Say the number to reach: reachKey and reachTarget.");
  const lute = await go("add_objective", { playthrough: pid, act: "2", text: "Speech to 40 at the inns", kind: "reach", reachKey: "Speech", reachTarget: 40 });
  expect(lute.isError, lute.text).toBe(false);

  const sug = await go("suggest_objective", { playthrough: pid, act: "1", text: "The Book of Love", kind: "once", link: { kind: "line", name: "The Book of Love" }, byHand: true });
  expect(sug.isError, sug.text).toBe(false);
  expect(sug.json().suggested).toBe(true);

  // A chapter that unlocks needs a real objective (WO-118); then one that unlocks when the hides are tanned.
  expect((await go("write_chapter", { playthrough: pid, title: "Made with Care", text: "The hide was rough under her hands.", unlocksWhen: "Tan a dragon" })).isError).toBe(true);
  const beat = await go("write_chapter", { playthrough: pid, title: "Made with Care", text: "The hide was rough under her hands.", act: "1", unlocksWhen: "Hunt and tan her first hides" });
  expect(beat.isError, beat.text).toBe(false);
  const chapter = await go("write_chapter", { playthrough: pid, title: "Chapter One: The Chapel by the Sea", text: "The chapel bells in Anvil rang the hours.\n\nShe learned the songs before her letters." });
  expect(chapter.isError, chapter.text).toBe(false);

  // Every objective can be ticked (WO-123), one the save reads too, when the player says; an estimate isn't a snapshot.
  expect((await go("set_status", { playthrough: pid, objective: "Warn Haelga, or expose her", status: "done" })).isError).toBe(false);
  expect((await go("set_status", { playthrough: pid, objective: "Warn Haelga, or expose her", status: "todo" })).isError).toBe(false);
  expect((await go("set_snapshot", { playthrough: pid, source: "hand", label: "Guess", level: 5, skills: {} })).isError).toBe(true);

  const got = (await go("get_playthrough", { playthrough: "E2E Kyria" })).json();
  expect(got.acts).toHaveLength(2);
  // The flat shape, the same fields add_objective takes.
  expect(got.acts[0].objectives[2]).toMatchObject({ text: "Reach level 6", kind: "reach", reachKey: "Level", reachTarget: 6 });
  expect(got.acts[0].objectives[1]).toMatchObject({ quest: "FreeformRiften11", stage: 12, fromSave: true });
  expect(got.acts[0].objectives[0]).toMatchObject({ fromSave: false });
  expect(got.acts[0].objectives[0]).not.toHaveProperty("byHand");
  const back = await go("set_objective", { playthrough: pid, objective: got.acts[0].objectives[2].objective, kind: "reach", reachKey: got.acts[0].objectives[2].reachKey, reachTarget: got.acts[0].objectives[2].reachTarget });
  expect(back.isError, back.text).toBe(false);
  expect(got.acts[0].objectives.map((o: { status: string }) => o.status)).toEqual(["to do", "to do", "to do", "to do", "suggested, waiting for the player"]);
  expect(got.done).toBe("0 of 6");

  const done = await go("finish_draft_playthrough", { playthrough: pid });
  expect(done.json()).toMatchObject({ ready: true, link: `${baseURL!.replace(/\/$/, "")}/p/${pid}` });

  const quests = await call(baseURL!, from, token, "suggest_quests", { level: 10 });
  expect(quests.isError, quests.text).toBe(false);
  for (const s of quests.json().suggestions) expect(s).toMatchObject({ checked: "files", openForYou: "open for you" });
});

test("on the site: private on its build's card under My characters, a tick opens the beat, Accept counts, by hand moves the meter", async ({ page, context }) => {
  await signIn(context);
  await page.goto("/me");
  // One grid since WO-114: the run sits on its build's card.
  const card = page.getByRole("article").filter({ has: page.getByRole("link", { name: "Test Shield-Wall", exact: true }) });
  // The one character card (WO-164): its act line and the Playthrough mark, and the card opens the character, whose first tab is Play.
  await expect(card.getByText("Playthrough", { exact: true })).toBeVisible();
  await expect(card.getByText(/^Act \d+ of \d+/)).toBeVisible();

  // Play is the first tab of the build's page (WO-116).
  const playTab = () => page.getByRole("tablist", { name: "Build sections" }).getByRole("tab", { name: /^Play/ });
  await page.goto(`/p/${pid}`);
  await expect(page.getByRole("heading", { level: 1, name: "E2E Kyria" })).toBeVisible();
  await expect(playTab()).toContainText("0 of 6 done");
  // The Levels tab is the build linked through the door (WO-111c).
  // Other specs add levels to the shared test build, so the count isn't fixed: the words are.
  await expect(page.getByRole("tablist", { name: "Build sections" }).getByRole("tab", { name: /^Build/ })).toContainText(/Levels 1 to \d+/);
  // A locked chapter is a dashed Story marker, never its text (WO-116).
  await expect(page.getByText("unlocks when this is done").first()).toBeVisible();
  await expect(page.getByText("The hide was rough under her hands.")).toHaveCount(0);

  await page.getByRole("checkbox", { name: "Hunt and tan her first hides" }).click();
  // Done, it folds under the list (WO-124); open the fold to see its chapter open.
  await page.getByText(/^✓\d+ done/).click();
  await expect(page.getByRole("link", { name: /^Story Made with Care/ })).toBeVisible();
  await expect(playTab()).toContainText("1 of 6 done");

  await page.getByRole("button", { name: "Accept" }).click();
  await expect(page.getByText("Suggested by E2E Claude")).toHaveCount(0);
  await expect(playTab()).toContainText("1 of 7 done");

  await expect(page.getByText("Level 6: not read yet")).toBeVisible();
  // No save yet: Where is she in your game? asks the owner, with Read a save and Enter by hand (WO-124).
  const where = page.getByRole("region", { name: "Where is she in your game?" });
  await expect(where).toContainText("Fill it in from a save, or by hand. The save ticks her quests for you.");
  await expect(where.getByRole("button", { name: "Read a save" })).toBeVisible();
  await expect(where.getByRole("button", { name: "Enter by hand" })).toBeVisible();
  await page.goto(`/p/${pid}/edit/play`);
  const stand = page.getByRole("region", { name: "Where you stand" });
  await stand.getByRole("button", { name: "Enter it by hand" }).click();
  await stand.getByRole("spinbutton", { name: "Level", exact: true }).fill("6");
  await stand.getByRole("button", { name: "Save", exact: true }).click();
  await expect(stand).toContainText("Level 6 | from your own entry");
  await page.goto(`/p/${pid}`);
  // Once there's an entry, one line says where she is, with Update (WO-124).
  await expect(page.getByLabel("Where she is")).toContainText(/^Level 6\. From your own entry, \d+ \w+\. Update ›$/);
  await expect(where).toHaveCount(0);
  // Reach level 6 is done now, so folded away with the rest of the done ones.
  await page.getByText(/^✓\d+ done/).click();
  await expect(page.getByText("Level 6 of 6", { exact: true })).toBeVisible();
  await expect(playTab()).toContainText("2 of 7 done");
});

test("the reader shows the chapter, the opened beat and its way back to the game", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/p/${pid}/tale`);
  const reader = page.getByRole("region", { name: /^Reading: / });
  await expect(reader.getByRole("heading", { name: "Chapter One: The Chapel by the Sea" })).toBeVisible();
  await expect(reader.getByText("The chapel bells in Anvil rang the hours.")).toBeVisible();
  await reader.getByRole("navigation", { name: "The story" }).getByRole("link").filter({ hasText: "Next ›Made with Care" }).click();
  await expect(reader.getByRole("heading", { name: "Made with Care" })).toBeVisible();
  const back = reader.getByRole("link", { name: "Hunt and tan her first hides" });
  await expect(back).toBeVisible();
  await back.click();
  await expect(page).toHaveURL(new RegExp(`/p/${pid}\\?act=1#o\\d+`));
});

test("editing by hand: a @quest mention, and the rule under a refused objective", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/p/${pid}/edit`);
  await expect(page.getByRole("region", { name: "Edit bar" })).toContainText("EditingE2E Kyria");
  await page.getByRole("button", { name: "Add an objective" }).click();
  const box = page.getByRole("combobox", { name: "Objective" }).last();
  await box.fill("@Spread the");
  await page.getByRole("option", { name: /^Spread the Love/ }).first().click();
  // A new objective is kept in the form until Add (WO-179); added, it's a row like Play's (WO-117); opened, its quest link shows.
  await page.getByRole("button", { name: "Add", exact: true }).click();
  const row = page.getByRole("button", { name: "Edit Spread the Love" });
  await expect(row).toBeVisible();
  await expect.poll(async () => (await page.reload(), await page.getByRole("button", { name: "Edit Spread the Love" }).count())).toBeGreaterThan(0);
  await page.getByRole("button", { name: "Edit Spread the Love" }).click();
  await expect(page.getByText("Quest: Spread the Love")).toBeVisible();

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
  // A 403 naming the scope it lacks (WO-109b).
  expect(write.status).toBe(403);
  expect(write.text).toContain("playthroughs:write");
});

// WO-111a: a quest the save decides can be ticked by the player until a snapshot shows its stage.
test("a quest objective the save decides: ticked by the player, then the save's word once it shows the stage", async ({ page, context, baseURL }) => {
  await signIn(context);
  const go = (name: string, args: object) => call(baseURL!, from, token, name, args);
  const added = await go("add_objective", { playthrough: pid, act: "2", text: "Spread the Love", kind: "once", link: { kind: "quest", name: "Spread the Love" }, quest: "Spread the Love", stage: 10 });
  expect(added.isError, added.text).toBe(false);
  // Linked to a quest, the save ticks it by default (WO-123).
  expect((await go("get_playthrough", { playthrough: pid })).json().acts[1].objectives.find((o: { text: string }) => o.text === "Spread the Love")).toMatchObject({ fromSave: true });

  await page.goto(`/p/${pid}?act=2`);
  const row = page.locator(`#o${added.json().objective}`);
  await row.getByRole("checkbox", { name: "Spread the Love" }).click();
  // The box says it (WO-118: the status on the right says only Under way), in the fold of done ones (WO-124).
  const fold = page.getByText(/^✓\d+ done/);
  await fold.click();
  await expect(row.getByRole("checkbox", { name: "Spread the Love" })).toHaveAttribute("aria-checked", "true");

  const snap = await go("set_snapshot", { playthrough: pid, source: "save", label: "Save 8", level: 7, skills: {}, questStages: { FreeformRiften05: 10 } });
  expect(snap.isError, snap.text).toBe(false);
  await page.reload();
  await fold.click();
  // The save's word can't be ticked away: a done box, not a checkbox, and From your save.
  await expect(row.getByText("From your save")).toBeVisible();
  await expect(row.getByRole("checkbox")).toHaveCount(0);
  await expect(row.getByText("✓", { exact: true })).toBeVisible();
});
