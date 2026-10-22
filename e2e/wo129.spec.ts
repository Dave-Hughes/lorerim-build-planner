/**
 * WO-129: an act with a thread. Through the door, an act gets a route and its objectives stops, and the warnings flag a
 * trip back, a promised destination and an objective at no stop. Play lists the objectives under their stops in route
 * order, On the road last, at 1440 and 390; the editor adds a stop and puts an objective at it.
 */
import { expect, test } from "@playwright/test";
import { call, ip, signIn, tokenFor } from "./helpers";

test.describe.configure({ mode: "serial" });

const from = ip();
let pid = "";

test("an assistant gives an act a route and puts its objectives on it", async ({ page, context, baseURL }) => {
  await signIn(context);
  const token = (await tokenFor(page, context, baseURL!, from)).access_token;
  const go = (name: string, args: object) => call(baseURL!, from, token, name, args);

  pid = (await go("create_playthrough", { name: "E2E Road" })).json().playthrough;
  expect((await go("add_act", { playthrough: pid, name: "The Bard's Road", levels: "6 to 12", place: "Ivarstead", goal: "On foot, a song at every inn." })).isError).toBe(false);
  const routed = await go("set_act", {
    playthrough: pid,
    act: "1",
    route: [
      { place: "Riften", why: "She leaves Riften on foot, the long way." },
      { place: "Ivarstead", why: "Fastred's parents asked after her." },
      { place: "Whiterun", why: "Alessandra's dagger." },
    ],
  });
  expect(routed.isError, routed.text).toBe(false);

  const add = (o: object) => go("add_objective", { playthrough: pid, act: "1", kind: "once", ...o });
  expect((await add({ text: "Bring Fastred home", stop: "ivarstead", why: "Asked by her parents in Ivarstead." })).isError).toBe(false);
  const back = await add({ text: "Deliver Romlyn's mead to Wilhelm", stop: "Ivarstead", link: { kind: "quest", name: "Under the Table" } });
  expect(back.json().warnings).toEqual(expect.arrayContaining([expect.objectContaining({ code: "route-backtrack", message: expect.stringContaining("the route left Riften at its first stop") })]));
  expect((await add({ text: "Catch the white horse", stop: "Whiterun", link: { kind: "quest", name: "Running Wild" }, why: "On the way out of Whiterun." })).json().changesTheRun).toHaveLength(3);
  expect((await add({ text: "Clear Redoran's Retreat", why: "Her first bandits." })).isError).toBe(false);
  // A stop that isn't on the route is refused, with the route's stops.
  const off = await add({ text: "See the Dawnstar shrine", stop: "Dawnstar" });
  expect(off.isError).toBe(true);
  expect(off.text).toContain("Its stops are: Riften, Ivarstead, Whiterun.");

  const got = (await go("get_playthrough", { playthrough: pid })).json();
  expect(got.acts[0].route.map((r: { place: string }) => r.place)).toEqual(["Riften", "Ivarstead", "Whiterun"]);
  expect(got.acts[0].objectives.map((o: { stop?: string }) => o.stop ?? null)).toEqual(["Ivarstead", "Ivarstead", "Whiterun", null]);
  expect(got.warnings.map((w: { code: string }) => w.code)).toEqual(expect.arrayContaining(["route-backtrack", "route-no-stop"]));
  const done = (await go("finish_draft_playthrough", { playthrough: pid })).json();
  expect(done.warnings.map((w: { code: string }) => w.code)).toEqual(expect.arrayContaining(["route-backtrack", "route-no-stop"]));
});

for (const width of [1440, 390]) {
  test(`Play lists the act's objectives under its stops at ${width}`, async ({ page, context }) => {
    await signIn(context);
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`/p/${pid}`);
    const stops = page.locator("section[aria-label]").filter({ has: page.locator("[class*=stopName]") });
    await expect(stops.locator("[class*=stopName]")).toHaveText(["Ivarstead", "Whiterun", "On the road"]);
    await expect(stops.first()).toContainText("Fastred's parents asked after her.");
    await expect(stops.first()).toContainText("Bring Fastred home");
    await expect(stops.last()).toContainText("Clear Redoran's Retreat");
    await page.screenshot({ path: `test-results/wo129-play-${width}.png`, fullPage: true });
  });
}

test("the act editor adds a stop and puts an objective at it", async ({ page, context }) => {
  await signIn(context);
  await page.goto(`/p/${pid}/edit/play?act=1`);
  await page.getByRole("button", { name: "+ Add a stop" }).click();
  await page.getByLabel("Stop 4", { exact: true }).fill("Markarth");
  await page.getByLabel("Why she goes to stop 4").fill("West, to the Reach.");
  await page.getByLabel("Why she goes to stop 4").blur();
  await expect(page.getByLabel("Stop 4", { exact: true })).toHaveValue("Markarth");
  await page.getByRole("button", { name: "Move Markarth up" }).click();
  await expect(page.getByLabel("Stop 3", { exact: true })).toHaveValue("Markarth");
  await page.getByRole("button", { name: "Edit Clear Redoran's Retreat" }).click();
  // The band says Saved at rest, so wait for the save itself before leaving.
  await Promise.all([page.waitForResponse((r) => r.request().method() === "POST" && r.url().includes("/edit/play")), page.getByLabel("Stop", { exact: true }).selectOption("Markarth")]);
  await page.goto(`/p/${pid}`);
  await expect(page.locator("[class*=stopName]")).toHaveText(["Ivarstead", "Markarth", "Whiterun"]);
});
