/**
 * WO-122: character creation through the door is checked as Set up checks it. A creation Set up would
 * still ask about is refused with the choices named, and nothing is saved.
 */
import { expect, test } from "@playwright/test";
import { call, ip, savedInBand, signIn, tokenFor } from "./helpers";

const from = ip();
const nord = { race: "Nord", birthsign: "Warrior", majors: ["Two-Handed", "Heavy Armor", "Smithing"], minors: ["Block", "Restoration", "Speech", "One-Handed", "Alchemy", "Wayfarer"] };

test("a creation with 2 minors, a trait without its choice or a start without its option is refused with the choices", async ({ page, context, baseURL }) => {
  await signIn(context);
  const t = await tokenFor(page, context, baseURL!, from);
  const go = (args: object) => call(baseURL!, from, t.access_token, "create_build", { name: "E2E Unfinished", ...nord, start: "Regular (Inn)", startOption: "Random", ...args });

  const two = await go({ minors: ["Block", "Restoration"] });
  expect(two.isError).toBe(true);
  expect(two.text).toBe("Nothing was saved. Character creation: Choose 4 more minor skills (6 in all).");

  const fatal = await go({ traits: ["Fatal Attraction"] });
  expect(fatal.text).toBe("Nothing was saved. Character creation: Fatal Attraction needs a choice: Male or Female.");

  const pilgrim = await go({ start: "Pilgrim (Temple)", startOption: undefined });
  expect(pilgrim.text).toBe(
    "Nothing was saved. Character creation: Pilgrim (Temple) needs a temple: Random, Temple of the Divines, Temple of Dibella, Temple of Kynareth, Temple of Mara or Temple of Talos.",
  );

  const listed = (await call(baseURL!, from, t.access_token, "list_my_builds", {})).json();
  expect(listed.filter((b: { name: string }) => b.name === "E2E Unfinished")).toHaveLength(0);
});

test("traitChoices go in, and set_creation changes creation, refused until every choice is made", async ({ page, context, baseURL }) => {
  await signIn(context);
  const t = await tokenFor(page, context, baseURL!, from);
  const go = (name: string, args: object) => call(baseURL!, from, t.access_token, name, args);

  const made = await go("create_build", { name: "E2E Chosen", ...nord, traits: ["Fatal Attraction"], traitChoices: { "Fatal Attraction": "Female" }, start: "Regular (Inn)", startOption: "The Bee and Barb" });
  expect(made.isError, made.text).toBe(false);
  const build = made.json().build;
  expect((await go("get_build", { build })).json()).toMatchObject({ traits: ["Fatal Attraction"], traitChoices: { "Fatal Attraction": "Female" }, start: "Regular (Inn)", startOption: "The Bee and Barb" });

  // A new start without its option: refused with the temples, and nothing saved.
  const pilgrim = await go("set_creation", { build, start: "Pilgrim (Temple)" });
  expect(pilgrim.text).toMatch(/^Nothing was saved\. Character creation: Pilgrim \(Temple\) needs a temple: Random, .* or Temple of Talos\.$/);
  expect((await go("get_build", { build })).json().start).toBe("Regular (Inn)");

  const fixed = await go("set_creation", { build, start: "Pilgrim (Temple)", startOption: "Temple of Mara", traits: ["Fatal Attraction", "Master of One"], masterOfOneSkill: "Two-Handed" });
  expect(fixed.isError, fixed.text).toBe(false);
  expect(fixed.json().creation).toMatchObject({ start: "Pilgrim (Temple)", startOption: "Temple of Mara", traitChoices: { "Fatal Attraction": "Female" }, masterOfOneSkill: "Two-Handed" });
  // Only what's sent changes: the minors and the mode stay.
  expect((await go("get_build", { build })).json()).toMatchObject({ minors: nord.minors, mode: "Naaktiid", start: "Pilgrim (Temple)", startOption: "Temple of Mara" });
});

test("get_creation answers through the door with the choices Set up offers", async ({ page, context, baseURL }) => {
  await signIn(context);
  const t = await tokenFor(page, context, baseURL!, from);
  const c = (await call(baseURL!, from, t.access_token, "get_creation", {})).json();
  expect(c.counts).toMatchObject({ majors: { count: 3 }, minors: { count: 6 }, traits: { upTo: 2 } });
  expect(c.starts.find((s: { name: string }) => s.name === "Dragonborn").option).toEqual({ label: "Helgen Keep", options: ["Helgen Keep (Start)", "Helgen Keep (End)"] });
  expect(c.traits.find((x: { name: string }) => x.name === "Focused Combat").choice).toMatchObject({ options: ["One-Handed", "Two-Handed", "Marksman"], send: "traitChoices" });
});

test("Set up keeps the start: a mode and Details change saves only what changed, even after the door moved the start", async ({ page, context, baseURL }) => {
  test.setTimeout(90_000);
  await signIn(context);
  const t = await tokenFor(page, context, baseURL!, from);
  const go = (name: string, args: object) => call(baseURL!, from, t.access_token, name, args);
  const made = await go("create_build", { name: "E2E Pilgrim", ...nord, start: "Pilgrim (Temple)", startOption: "Temple of Mara" });
  expect(made.isError, made.text).toBe(false);
  const build = made.json().build;

  // The mode and Details changed in Set up: the start reads back as it was.
  await page.goto(`/b/${build}/setup?step=mode`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Game mode and start");
  await page.getByRole("article").filter({ hasText: "Konahrik" }).getByRole("heading", { name: "Konahrik" }).click();
  await savedInBand(page);
  await page.goto(`/b/${build}/setup?step=name`);
  await page.getByRole("main").getByLabel("Description", { exact: true }).fill("A pilgrim of Mara.");
  await savedInBand(page);
  expect((await go("get_build", { build })).json()).toMatchObject({ mode: "Konahrik", start: "Pilgrim (Temple)", startOption: "Temple of Mara", description: "A pilgrim of Mara." });

  // Kyria's case: Set up open while the connector changes the start, then the mode changed there. The connector's start stays.
  await page.goto(`/b/${build}/setup?step=mode`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Game mode and start");
  const moved = await go("set_creation", { build, start: "Dragonborn", startOption: "Helgen Keep (End)" });
  expect(moved.isError, moved.text).toBe(false);
  await page.getByRole("article").filter({ hasText: "Naaktiid" }).getByRole("heading", { name: "Naaktiid" }).click();
  await savedInBand(page);
  expect((await go("get_build", { build })).json()).toMatchObject({ mode: "Naaktiid", start: "Dragonborn", startOption: "Helgen Keep (End)" });

  // /admin shows the build's saves, who made each, and what changed.
  await page.goto(`/admin?build=${build}`);
  const saves = page.getByRole("list", { name: "Saves of E2E Pilgrim" });
  await expect(saves).toBeVisible();
  await expect(saves.getByRole("listitem").first()).toContainText("Set up");
  await expect(saves.getByRole("listitem").first()).toContainText("Mode: Konahrik to Naaktiid");
  await expect(saves).toContainText("Start: Pilgrim (Temple), Temple of Mara to Dragonborn, Helgen Keep (End)");
  await expect(saves).toContainText("Connector (");
  await expect(saves).toContainText("Mode: Naaktiid to Konahrik");
});
