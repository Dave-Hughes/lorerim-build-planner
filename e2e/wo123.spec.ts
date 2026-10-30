/**
 * WO-123 Part 1 (the boxes and Ticks from your save) is progress tracking, off since WO-181: e2e/wo181-tracking.spec.ts. Part 2: drafting through the door,
 * an objective that names a quest but isn't linked comes back with a warning, counted on /admin.
 */
import { expect, test } from "@playwright/test";
import { KYRIA_PLAYTHROUGH_ID } from "./seed";
import { call, ip, signIn, tokenFor } from "./helpers";

test("drafting through the door: an unlinked quest objective and an unreadable number come back with warnings, counted", async ({ page, context, baseURL }) => {
  const from = ip();
  await signIn(context);
  const t = await tokenFor(page, context, baseURL!, from);
  const go = (name: string, args: object) => call(baseURL!, from, t.access_token, name, args);
  const added = await go("add_objective", { playthrough: KYRIA_PLAYTHROUGH_ID, act: "3", text: "Get a Mark of Dibella from Haelga at the bunkhouse", kind: "once" });
  expect(added.isError, added.text).toBe(false);
  expect(added.json().warnings).toEqual([
    { code: "objective-not-linked", message: "'Get a Mark of Dibella from Haelga at the bunkhouse' is Caught Red Handed (FreeformRiften11); link it so the save can tick it." },
  ]);
  const books = await go("add_objective", { playthrough: KYRIA_PLAYTHROUGH_ID, act: "3", text: "Read ten books", kind: "reach", reachKey: "books read", reachTarget: 10 });
  expect(books.json().warnings).toEqual([{ code: "reach-not-readable", message: "books read 10 can't be read from a save; the player ticks it." }]);
  const lute = await go("add_objective", { playthrough: KYRIA_PLAYTHROUGH_ID, act: "3", text: "Play the lute well", kind: "reach", reachKey: "Lute", reachTarget: 66 });
  expect(lute.json()).not.toHaveProperty("warnings");
  const got = (await go("get_playthrough", { playthrough: KYRIA_PLAYTHROUGH_ID })).json();
  expect(got.warnings.map((w: { objective: string }) => w.objective)).toEqual(expect.arrayContaining([added.json().objective, books.json().objective]));
  const done = (await go("finish_draft_playthrough", { playthrough: KYRIA_PLAYTHROUGH_ID })).json();
  expect(done).toMatchObject({ ready: true, warningsNote: "Fix these or tell the player why you left them." });
  for (const r of [added, books, lute]) {
    const removed = await go("remove_objective", { playthrough: KYRIA_PLAYTHROUGH_ID, objective: r.json().objective });
    expect(removed.isError, removed.text).toBe(false);
  }

  await page.goto("/admin");
  const connector = page.getByRole("region", { name: "Connector" });
  await expect(connector).toContainText("objective-not-linked");
  await expect(connector).toContainText("reach-not-readable");
});
