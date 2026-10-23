/**
 * WO-148: through the door, suggest_quests takes a hold and never leaves start empty; suggest_places takes a place and levels
 * with no stored act; get_quest says what a quest pays and a locked door isn't a need; get_rules has the Tome Trials; a plan
 * whose later act's gates the earlier ones don't reach is warned, and a route that leaves a board town says to read its board.
 */
import { expect, test } from "@playwright/test";
import { call, ip, signIn, tokenFor } from "./helpers";

test("the door: holds, places by level, what a quest pays, a door that isn't a need, the Tome Trials", async ({ page, context, baseURL }) => {
  await signIn(context);
  const from = ip();
  const token = (await tokenFor(page, context, baseURL!, from)).access_token;
  const go = (name: string, args: object) => call(baseURL!, from, token, name, args);

  const haafingar = (await go("suggest_quests", { level: 15, where: "Haafingar" })).json();
  expect(haafingar.suggestions.map((s: { name: string }) => s.name)).toEqual(expect.arrayContaining(["The Bards College", "The Wolf Queen Awakened"]));
  for (const s of haafingar.suggestions) expect(typeof s.start).toBe("string");

  const near = (await go("suggest_places", { where: "Solitude", levels: "15 to 20" })).json();
  expect(near.towns).toContain("Solitude");
  expect(near.places[0]).toHaveProperty("when");
  expect((await go("suggest_places", { where: "Solitude" })).isError).toBe(true);

  const heart = (await go("get_quest", { id: "T01" })).json();
  expect(heart.quest.pays).toMatch(/no quest XP$/);
  const rat = (await go("get_quest", { name: "A Rat Problem", level: 10 })).json();
  expect(rat.quest.start.needs ?? []).toEqual([]);
  expect(rat.quest.start.onTheWay[0]).toMatch(/^The door from Whiterun into Igna's Basement needs the Key/);

  const rules = (await go("get_rules", {})).json();
  expect(rules.tomeTrials).toMatchObject({ exams: 36, after: "Tending the Flames" });
});

test("a plan whose Act IV Dawnguard the earlier acts don't reach is warned; a route out of a board town says to read the board", async ({ page, context, baseURL }) => {
  await signIn(context);
  const from = ip();
  const token = (await tokenFor(page, context, baseURL!, from)).access_token;
  const go = (name: string, args: object) => call(baseURL!, from, token, name, args);
  const pid = (await go("create_playthrough", { name: "E2E Gates" })).json().playthrough;
  expect((await go("add_act", { playthrough: pid, name: "Morthal", levels: "20 to 25", place: "Morthal", goal: "The marsh.", route: [{ place: "Markarth", why: "She leaves." }, { place: "Solitude", why: "Work." }] })).isError).toBe(false);
  expect((await go("add_act", { playthrough: pid, name: "The Dawn", levels: "25 to 28", place: "Fort Dawnguard", goal: "Vampires." })).isError).toBe(false);
  expect((await go("add_objective", { playthrough: pid, act: "2", kind: "once", text: "Join the Dawnguard", link: { kind: "line", name: "Dawnguard" } })).isError).toBe(false);
  const got = (await go("get_playthrough", { playthrough: pid })).json();
  const gate = got.warnings.find((w: { code: string }) => w.code === "gate-chain");
  expect(gate.message).toContain("Act II The Dawn links Dawnguard, which waits for level 30");
  expect(gate.message).toContain("Laid to Rest fits Act I, in Morthal.");
  expect(got.acts[0].route[0].missives).toBe("Read Markarth's board for notes addressed to Solitude.");
  expect(got.acts[0].route[1].missives).toBeUndefined();
  // A lump of missives is warned about when it is added.
  const lump = await go("add_objective", { playthrough: pid, act: "1", kind: "once", text: "Do five missives on the road" });
  expect(lump.json().warnings.map((w: { code: string }) => w.code)).toContain("missives-lump");
});
