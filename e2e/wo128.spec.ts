/**
 * WO-128: places with a reason, through the door. suggest_places on an act set in Riverwood and one in Ivarstead, a place
 * objective linked by its name, and a passed-by line; then Play shows the place objective with its hook and the passed-by
 * line under the act's goal, at 1440 and 390.
 */
import { expect, test } from "@playwright/test";
import { call, ip, signIn, tokenFor } from "./helpers";

test.describe.configure({ mode: "serial" });

const from = ip();
let pid = "";

test("an assistant plans an act's places through the door", async ({ page, context, baseURL }) => {
  await signIn(context);
  const token = (await tokenFor(page, context, baseURL!, from)).access_token;
  const go = (name: string, args: object) => call(baseURL!, from, token, name, args);

  const made = await go("create_playthrough", { name: "E2E Places" });
  expect(made.isError, made.text).toBe(false);
  pid = made.json().playthrough;
  expect((await go("add_act", { playthrough: pid, name: "Riverwood", levels: "1 to 5", place: "Riverwood", goal: "Find work in Riverwood." })).isError).toBe(false);
  expect((await go("add_act", { playthrough: pid, name: "The Throat", levels: "6 to 12", place: "Ivarstead", goal: "Climb to High Hrothgar." })).isError).toBe(false);

  const river = await go("suggest_places", { playthrough: pid, act: "1" });
  expect(river.isError, river.text).toBe(false);
  const r = river.json();
  expect(r.towns).toContain("Riverwood");
  const mine = r.places.find((p: { place: string }) => p.place === "Embershard Mine");
  expect(mine.when).toBe("fits now");
  expect(JSON.stringify(mine.pointers)).toContain("There is a bandit camp nearby. Embershard Mine I think");
  expect(r.places.find((p: { place: string }) => p.place === "Bleak Falls Barrow").questGoesThere).toContain("The Golden Claw");

  const ivar = (await go("suggest_places", { playthrough: pid, act: "2" })).json();
  expect(ivar.places.find((p: { place: string }) => p.place === "Geirmund's Hall").when).toBe("plant now, pay off later (levels 20 and up)"); // its boss is level 40, judged leniently since WO-148 item 9

  const clear = await go("add_objective", {
    playthrough: pid,
    act: "1",
    text: "Clear Embershard Mine",
    kind: "once",
    link: { kind: "place", name: "Embershard Mine" },
    why: "Alvor says the village needs the mine's iron back. Her own reason to step in.",
  });
  expect(clear.isError, clear.text).toBe(false);
  const passed = await go("set_act", { playthrough: pid, act: "2", passedBy: [{ place: "Geirmund's Hall", why: "not her fight yet" }] });
  expect(passed.isError, passed.text).toBe(false);

  const got = (await go("get_playthrough", { playthrough: pid })).json();
  expect(got.acts[0].objectives[0]).toMatchObject({ text: "Clear Embershard Mine", link: { kind: "place", name: "Embershard Mine" }, fromSave: false });
  expect(got.acts[1].passedBy).toEqual([{ place: "Geirmund's Hall", why: "not her fight yet" }]);
  // Now used: suggest_places says so.
  expect((await go("suggest_places", { playthrough: pid, act: "2" })).json().alreadyUsed.linked).toEqual([{ place: "Embershard Mine", act: "Act I Riverwood", type: "Mine", town: "Riverwood" }]);

  // A place that isn't in the index is refused.
  const made_up = await go("add_objective", { playthrough: pid, act: "1", text: "Clear Embershard Mines of Doom", kind: "once", link: { kind: "place", name: "Embershard Mines of Doom" } });
  expect(made_up.isError).toBe(true);
});

for (const width of [1440, 390]) {
  test(`Play shows the place objective and the passed-by line at ${width}`, async ({ page, context }) => {
    await signIn(context);
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`/p/${pid}?act=1`);
    const row = page.locator(".obj, [id^='o']").filter({ hasText: "Clear Embershard Mine" }).first();
    await expect(row).toBeVisible();
    await expect(row).toContainText("Place");
    await expect(row).toContainText("Alvor says the village needs the mine's iron back.");
    await page.screenshot({ path: `test-results/wo128-place-${width}.png`, fullPage: true });
    await page.goto(`/p/${pid}?act=2`);
    await expect(page.getByText("Passed by: Geirmund's Hall (not her fight yet)")).toBeVisible();
    await page.screenshot({ path: `test-results/wo128-passed-by-${width}.png`, fullPage: true });
  });
}
